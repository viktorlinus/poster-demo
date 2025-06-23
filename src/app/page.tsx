'use client';
import { useState } from 'react';
import { STYLE_CONFIGS, DEFAULT_STYLE, getStyleDisplayName, generateMemoryPrompts } from '@/lib/styles';
import TextEditor from '@/components/TextEditor';
import { upscaleImage } from '@/lib/upscale';

interface PreviewResult {
  url: string;
  promptName: string;
  error?: string;
  quality?: string;
  upscaled?: boolean;
}

export default function Home() {
  const [previewResults, setPreviewResults] = useState<PreviewResult[]>();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [useVisionGenerate, setUseVisionGenerate] = useState(false);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [upscaling, setUpscaling] = useState<{[key: number]: boolean}>({});
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();

  // Upscale funktion
  const handleUpscale = async (index: number, imageUrl: string) => {
    setUpscaling(prev => ({ ...prev, [index]: true }));
    
    try {
      const upscaledUrl = await upscaleImage(imageUrl);
      
      // Uppdatera resultatet med upscaled version
      setPreviewResults(prev => 
        prev?.map((result, i) => 
          i === index 
            ? { ...result, url: upscaledUrl, upscaled: true }
            : result
        )
      );
      
      alert('Bild uppskalad! 4x högre upplösning ✨');
    } catch (error) {
      console.error('Upscaling error:', error);
      alert('Uppskalning misslyckades. Försök igen.');
    } finally {
      setUpscaling(prev => ({ ...prev, [index]: false }));
    }
  };

  // INGEN localStorage - bara håll i minnet under sessionen
  const clearResults = () => {
    setPreviewResults(undefined);
    setShowTextEditor(false);
    setSelectedImage(undefined);
  };

  // TEST-funktion: använd en dummy-bild för att testa text-editorn
  const testTextEditor = () => {
    const dummyImage = 'data:image/svg+xml;base64,' + btoa(`
      <svg width="1024" height="1536" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f8ff"/>
        <circle cx="512" cy="400" r="150" fill="#8b4513"/>
        <circle cx="450" cy="350" r="20" fill="#000"/>
        <circle cx="574" cy="350" r="20" fill="#000"/>
        <ellipse cx="512" cy="420" rx="30" ry="20" fill="#000"/>
        <text x="512" y="1400" text-anchor="middle" font-size="48" fill="#666">TEST HUSDJUR - för text-editor</text>
      </svg>
    `);
    
    setSelectedImage(dummyImage);
    setShowTextEditor(true);
  };

  // Direkt till text-editor med egen uppladdad bild
  const testWithOwnImage = () => {
    if (!file) {
      alert('Ladda upp en bild först!');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setShowTextEditor(true);
    };
    reader.readAsDataURL(file);
  };

  // Alla stilar kör nu optimerade 2 prompts
  const getMemoryPrompts = () => {
    return generateMemoryPrompts(style); // Optimerade 2 prompts för alla stilar
  };



  const handleClick = async () => {
    if (!file) {
      return;
    }
    
    setLoading(true);
    setPreviewResults(undefined);
    
    // Generera alla 4 memory prompts
    const memoryPrompts = getMemoryPrompts();
    
    try {
      // Skicka 4 parallella requests
      const promises = memoryPrompts.map(async (promptData) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('style', style);
        formData.append('customPrompt', promptData.prompt);
        formData.append('useVisionGenerate', useVisionGenerate.toString());
        formData.append('quality', quality);
        
        try {
          const res = await fetch('/api/preview', { 
            method: 'POST', 
            body: formData 
          });
          
          const data = await res.json();
          
          if (data.error) {
            return {
              url: '',
              promptName: promptData.name,
              error: data.error
            };
          }
          
          return {
            url: data.url || '',
            promptName: promptData.name,
            quality: data.quality
          };
        } catch {
          return {
            url: '',
            promptName: promptData.name,
            error: 'Network error'
          };
        }
      });
      
      const results = await Promise.all(promises);
      setPreviewResults(results);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Något gick fel, försök igen');
    } finally {
      setLoading(false);
    }
  };

  // Visa text editor om vi har valt en bild
  if (showTextEditor && selectedImage) {
    return (
      <TextEditor
        backgroundImageUrl={selectedImage}
        onSave={(dataUrl) => {
          console.log('Slutlig poster skapad:', dataUrl);
          // Här kan du visa download-länk eller spara
          alert('Poster skapad! (kolla konsolen för dataUrl)');
          setShowTextEditor(false);
        }}
        onCancel={() => setShowTextEditor(false)}
      />
    );
  }

  return (
    <main className="max-w-4xl mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Pet Memories - AI Poster MVP</h1>
      
      {/* UTVECKLINGS-KNAPP för att testa text-editorn */}
      <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-2">🛠️ UTVECKLING: Testa text-editorn</h3>
        <div className="space-y-2">
          <button 
            onClick={testWithOwnImage}
            disabled={!file}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📷 Använd min uppladdade bild i text-editorn
          </button>
          <button 
            onClick={testTextEditor}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 font-medium"
          >
            🎨 Eller använd dummy-bild
          </button>
        </div>
        <p className="text-sm text-yellow-700 mt-2">Hoppa direkt till text-editorn utan AI-generering</p>
      </div>
      
      {previewResults && (
        <button 
          onClick={clearResults}
          className="mb-4 bg-gray-500 text-white py-1 px-3 rounded text-sm hover:bg-gray-600"
        >
          Rensa bilder (försvinner vid siduppdatering)
        </button>
      )}
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Ladda upp husdjursporträtt
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setFile(e.target.files?.[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Metod
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="method" 
                checked={!useVisionGenerate}
                onChange={() => setUseVisionGenerate(false)}
                className="mr-2"
              />
              Edit (nuvarande)
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="method" 
                checked={useVisionGenerate}
                onChange={() => setUseVisionGenerate(true)}
                className="mr-2"
              />
              Vision + Generate (ny)
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {useVisionGenerate 
              ? "Använder GPT-4.1-mini för att beskriva husdjuret, sedan genererar ny konstbild"
              : "Redigerar originalbilden direkt med gpt-image-1"
            }
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Bildkvalitet
          </label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="quality" 
                value="low"
                checked={quality === 'low'}
                onChange={e => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                className="mr-2"
              />
              Low
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="quality" 
                value="medium"
                checked={quality === 'medium'}
                onChange={e => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                className="mr-2"
              />
              Medium
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="quality" 
                value="high"
                checked={quality === 'high'}
                onChange={e => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                className="mr-2"
              />
              High
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Välj konststil
          </label>
          <select 
            value={style}
            onChange={e => setStyle(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(STYLE_CONFIGS).map(([key, config]) => (
              <option key={key} value={key}>
                {config.displayName}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleClick}
          disabled={!file || loading}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 font-semibold"
        >
          {loading 
            ? `Genererar 2 ${getStyleDisplayName(style)}-varianter (${quality} quality)...` 
            : `Generera 2 optimerade varianter (${quality} quality)`
          }
        </button>
      </div>

      {previewResults && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Dina AI-genererade husdjursposters:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewResults.map((result, index) => (
              <div key={index} className="border-2 border-gray-300 rounded-lg p-4">
                <h3 className="font-medium mb-2">
                  {result.promptName}
                  <div className="flex gap-2 mt-1">
                    {result.quality && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {result.quality} quality
                      </span>
                    )}
                    {result.upscaled && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        4x upscaled
                      </span>
                    )}
                  </div>
                </h3>
                {result.error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="text-sm">Fel: {result.error}</p>
                  </div>
                ) : result.url ? (
                  <>
                    <img 
                      src={result.url} 
                      alt={`AI Generated Poster - ${result.promptName}`}
                      className="w-full rounded-lg shadow-md mb-3"
                    />
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedImage(result.url);
                          setShowTextEditor(true);
                        }}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 font-medium"
                      >
                        Lägg till text & personalisera
                      </button>
                      
                      {!result.upscaled && (
                        <button
                          onClick={() => handleUpscale(index, result.url)}
                          disabled={upscaling[index]}
                          className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {upscaling[index] ? 'Uppskalerar... (30-60s)' : '🚀 Upskala till 4x kvalitet'}
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Ingen bild genererad</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Detta är {quality}-kvalitets förhandsvisningar i {getStyleDisplayName(style)}-stil. Jämför resultaten för att se vilken prompt som bevarar likheten bäst!
          </p>
        </div>
      )}
    </main>
  );
}