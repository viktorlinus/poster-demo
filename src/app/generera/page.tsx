'use client';
import { useState, useEffect } from 'react';
import { STYLE_CONFIGS, DEFAULT_STYLE, getStyleDisplayName, generateMemoryPrompts } from '@/lib/styles';
import { saveGeneration, loadGenerations, type Generation } from '@/lib/generationHistory';
import { businessEvents } from '@/lib/analytics';
import TextEditor from '@/components/TextEditor';
import {
  Upload, 
  Sparkles, 
  Palette, 
  Download, 
  ArrowLeft, 
  Camera,
  Eye,
  EyeOff,
  Crown,
  Wand2,
  AlertCircle
} from 'lucide-react';

interface PreviewResult {
  url: string;
  promptName: string;
  error?: string;
  quality?: string;
  upscaled?: boolean;
}

export default function GenerateAIPoster() {
  const [previewResults, setPreviewResults] = useState<PreviewResult[]>();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [streamingProgress, setStreamingProgress] = useState<number>(0);
  const [currentGenerating, setCurrentGenerating] = useState<string>('');
  const [usageInfo, setUsageInfo] = useState<{used: number, remaining: number, total: number} | null>(null);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<Generation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Simulate streaming progress during generation
  const simulateStreaming = () => {
    setStreamingProgress(0);
    const interval = setInterval(() => {
      setStreamingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 5;
      });
    }, 800);
    return interval;
  };

  // Load history from IndexedDB on component mount
  useEffect(() => {
    fetchUsageInfo();
    loadHistoryFromDB();
  }, []);
  
  const loadHistoryFromDB = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await loadGenerations();
      setGenerationHistory(history);
      console.log('💾 Loaded', history.length, 'generations from IndexedDB');
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchUsageInfo = async () => {
    try {
      const response = await fetch('/api/usage');
      const data = await response.json();
      
      if (response.ok) {
        setUsageInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch usage info:', error);
    }
  };

  const getMemoryPrompts = () => {
    return generateMemoryPrompts(style);
  };

  const handleGenerateClick = async () => {
    if (!file) return;
    
    // Track AI generation started
    businessEvents.aiGenerationStarted(getStyleDisplayName(style));
    const generationStartTime = Date.now();
    
    // Reset any previous rate limit errors
    setRateLimitError(null);
    
    // CHECK RATE LIMIT ONCE BEFORE STARTING
    try {
      const rateLimitCheck = await fetch('/api/check-rate-limit');
      const rateLimitData = await rateLimitCheck.json();
      
      if (!rateLimitData.allowed) {
        setRateLimitError(rateLimitData.message || 'För många förfrågningar idag.');
        await fetchUsageInfo();
        return;
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
    }
    
    setLoading(true);
    setPreviewResults(undefined);
    setCurrentGenerating('Förbereder AI-generering...');
    
    // Start streaming simulation
    const streamInterval = simulateStreaming();
    
    const memoryPrompts = getMemoryPrompts();
    
    try {
      setCurrentGenerating('Analyserar husdjurets unika drag...');
      
      const results: PreviewResult[] = [];
      
      for (let i = 0; i < memoryPrompts.length; i++) {
        const promptData = memoryPrompts[i];
        setCurrentGenerating(`Skapar ${promptData.name.toLowerCase()}...`);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('style', style);
        formData.append('customPrompt', promptData.prompt);
        formData.append('useVisionGenerate', 'false');
        formData.append('quality', quality);
        formData.append('skipRateLimit', 'true');
        
        try {
          const res = await fetch('/api/preview', { 
            method: 'POST', 
            body: formData 
          });
          
          const data = await res.json();
          
          const result = {
            url: data.url || '',
            promptName: promptData.name,
            error: data.error,
            quality: data.quality
          };
          
          results.push(result);
          setPreviewResults([...results]);
          
          // Small delay between generations for streaming effect
          if (i < memoryPrompts.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch {
          results.push({
            url: '',
            promptName: promptData.name,
            error: 'Network error'
          });
        }
      }
      
      setCurrentGenerating('Slutför generering...');
      clearInterval(streamInterval);
      setStreamingProgress(100);
      
      // Track AI generation completed
      const completionTime = (Date.now() - generationStartTime) / 1000; // Convert to seconds
      businessEvents.aiGenerationCompleted(getStyleDisplayName(style), completionTime);
      
      // SPARA I INDEXEDDB (persistent mellan sessions!)
      const successfulResults = results.filter(r => r.url && !r.error);
      if (successfulResults.length > 0) {
        const newGeneration: Generation = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          style: style,
          quality: quality,
          results: successfulResults
        };
        
        // Spara till IndexedDB
        saveGeneration(newGeneration).then(() => {
          console.log('💾 Saved generation to IndexedDB');
        }).catch(error => {
          console.error('❌ Failed to save to IndexedDB:', error);
        });
        
        // Uppdatera state omedelbart för UI
        const updatedHistory = [newGeneration, ...generationHistory].slice(0, 20);
        setGenerationHistory(updatedHistory);
        console.log('🚀 Added generation to session history:', successfulResults.length, 'images');
      }
      
      // INCREMENT USAGE ONCE after successful generation
      try {
        await fetch('/api/increment-usage', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ style: style, category: style })
        });
        await fetchUsageInfo();
      } catch (error) {
        console.error('Failed to increment usage:', error);
      }
      
    } catch (error) {
      console.error('Error:', error);
      clearInterval(streamInterval);
    } finally {
      setLoading(false);
      setStreamingProgress(0);
      setCurrentGenerating('');
    }
  };

  // Image protection component
  const ProtectedImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => (
    <div className="relative group">
      <img 
        src={src} 
        alt={alt}
        className={className}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      />
      {/* Preview watermarks */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Diagonal PREVIEW text */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-black/15 font-bold text-4xl transform rotate-45"
          style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.3)' }}
        >
          PREVIEW
        </div>
        {/* Bottom logo */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-black/8 font-semibold text-sm">
          🐾 Pet Memories
        </div>
      </div>
    </div>
  );

  // Show text editor
  if (showTextEditor && selectedImage) {
    return (
      <TextEditor
        backgroundImageUrl={selectedImage}
        style={style}
        onCancel={() => setShowTextEditor(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Tillbaka</span>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                AI Poster Generator
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Powered by OpenAI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Ladda upp ditt husdjur
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Välj ett tydligt foto av ditt husdjur för bästa resultat. AI:n kommer att skapa 2 konstnärliga posters i vald stil att välja mellan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* File Upload */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Camera className="w-4 h-4 inline mr-2" />
                  Husdjursfoto
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setFile(e.target.files?.[0])}
                    className="block w-full text-sm text-gray-600 
                      file:mr-4 file:py-3 file:px-6 
                      file:rounded-full file:border-0 
                      file:text-sm file:font-semibold 
                      file:bg-gradient-to-r file:from-orange-500 file:to-pink-500
                      file:text-white file:shadow-lg
                      hover:file:shadow-xl file:transition-all file:duration-200
                      file:cursor-pointer cursor-pointer"
                  />
                </div>
                {file && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Quality Settings */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Crown className="w-4 h-4 inline mr-2" />
                  Bildkvalitet
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['low', 'medium'] as const).map((q) => (
                    <label key={q} className="cursor-pointer">
                      <input 
                        type="radio" 
                        name="quality" 
                        value={q}
                        checked={quality === q}
                        onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-lg border-2 transition-all text-center ${
                        quality === q 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}>
                        <div className="font-semibold capitalize">{q}</div>
                        <div className="text-xs mt-1">
                          {q === 'low' && 'Snabbt & billigt'}
                          {q === 'medium' && 'Optimal kvalitet'} 
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Palette className="w-4 h-4 inline mr-2" />
                Välj konststil
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                {Object.entries(STYLE_CONFIGS).map(([key, config]) => (
                  <label key={key} className="cursor-pointer">
                    <input 
                      type="radio"
                      name="style"
                      value={key}
                      checked={style === key}
                      onChange={(e) => setStyle(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      style === key 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}>
                      <div className="text-xl">{config.emoji || '🎨'}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">
                          {config.displayName}
                        </div>
                        <div className="text-xs text-gray-600">
                          Klassisk konststil
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mt-8">
            {/* Usage Info */}
            {usageInfo && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Du har <strong>{usageInfo.remaining}</strong> av <strong>{usageInfo.total}</strong> AI-genereringar kvar idag
                </p>
              </div>
            )}
            
            {/* Rate Limit Error */}
            {rateLimitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-red-800 mb-1">Dagsgräns nådd</h3>
                    <p className="text-sm text-red-700 mb-3">{rateLimitError}</p>
                    <button 
                      onClick={() => setRateLimitError(null)}
                      className="border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors"
                    >
                      Stäng meddelande
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleGenerateClick}
              disabled={!file || loading}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Genererar...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  Generera poster
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Progress */}
        {loading && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {currentGenerating || 'Genererar dina AI-posters...'}
              </h3>
              <div className="max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${streamingProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm">
                AI:n analyserar bilden och skapar konstposters... Detta tar vanligtvis 30-60 sekunder.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {previewResults && previewResults.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Dina AI-genererade poster
              </h2>
              <p className="text-gray-600">
                Välj din favorit och anpassa med text. Alla bilder är skyddade med preview-vattenmärken.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {previewResults.map((result, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {result.promptName}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      {result.quality && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {result.quality} kvalitet
                        </span>
                      )}
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        {getStyleDisplayName(style)}
                      </span>
                    </div>
                  </div>

                  {result.error ? (
                    <div className="p-6">
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="text-sm font-medium">⚠️ Generering misslyckades</p>
                        <p className="text-sm mt-1">{result.error}</p>
                      </div>
                    </div>
                  ) : result.url ? (
                    <>
                      <div className="relative bg-gray-100">
                        <ProtectedImage
                          src={result.url}
                          alt={`AI Generated Poster - ${result.promptName}`}
                          className="w-full h-auto"
                        />
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <button
                          onClick={() => {
                            setSelectedImage(result.url);
                            setShowTextEditor(true);
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Anpassa & Beställ
                        </button>
                        
                        <p className="text-xs text-gray-500 text-center">
                          Klicka för att lägga till text och gå till checkout
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="p-6">
                      <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Genererar...</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <EyeOff className="w-4 h-4 inline mr-1" />
                Alla bilder visar preview-vattenmärken. Slutgiltig poster blir ren utan märken efter beställning.
              </p>
            </div>
          </div>
        )}

        {/* Previous Generations */}
        {(generationHistory.length > 0 || isLoadingHistory) && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Tidigare generationer
              </h2>
              {isLoadingHistory ? (
                <div className="text-gray-600 flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Laddar sparade bilder...</span>
                </div>
              ) : (
                <p className="text-gray-600">
                  Välj från dina tidigare AI-genererade posters. Totalt {generationHistory.reduce((total, gen) => total + gen.results.length, 0)} bilder sparade permanent.
                </p>
              )}
            </div>

            {isLoadingHistory ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="p-4 bg-gray-100">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                      </div>
                    </div>
                    <div className="bg-gray-100 aspect-[2/3]"></div>
                    <div className="p-4">
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : generationHistory.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {generationHistory.slice(0, 4).flatMap(generation => 
                  generation.results.map((result, idx) => (
                    <div key={`${generation.id}-${idx}`} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {result.promptName}
                        </h3>
                        <div className="flex gap-2 mt-2">
                          {generation.quality && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {generation.quality} kvalitet
                            </span>
                          )}
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            {getStyleDisplayName(generation.style)}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {new Date(generation.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="relative bg-gray-100">
                        <ProtectedImage
                          src={result.url}
                          alt={`AI Generated Poster - ${result.promptName}`}
                          className="w-full h-auto"
                        />
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <button
                          onClick={() => {
                            setSelectedImage(result.url);
                            setShowTextEditor(true);
                          }}
                          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Använd denna poster
                        </button>
                        
                        <p className="text-xs text-gray-500 text-center">
                          Klicka för att anpassa med text och beställa
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Inga tidigare generationer att visa ännu. Generera några AI-posters så sparas de här automatiskt!
                </p>
              </div>
            )}

            {generationHistory.length > 4 && (
              <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  💾 Visar senaste {Math.min(4, generationHistory.length)} generationer av {generationHistory.length} totalt. Sparade permanent i din webbläsare!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}