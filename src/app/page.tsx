'use client';
import { useState } from 'react';
import { STYLE_CONFIGS, DEFAULT_STYLE, getStyleDisplayName, generateMemoryPrompts } from '@/lib/styles';

interface PreviewResult {
  url: string;
  promptName: string;
  error?: string;
}

export default function Home() {
  const [previewResults, setPreviewResults] = useState<PreviewResult[]>();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(DEFAULT_STYLE);

  // Flytta generateMemoryPrompts anrop här så TypeScript ser att den används
  const getMemoryPrompts = () => generateMemoryPrompts(style);



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

  return (
    <main className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">AI-Poster MVP</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Ladda upp spädbarnsporträtt
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
          {loading ? `Genererar 4 ${getStyleDisplayName(style)}-varianter...` : 'Generera 4 varianter (jämför prompts)'}
        </button>
      </div>

      {previewResults && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Dina AI-genererade poster-varianter:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewResults.map((result, index) => (
              <div key={index} className="border-2 border-gray-300 rounded-lg p-4">
                <h3 className="font-medium mb-2">{result.promptName}</h3>
                {result.error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="text-sm">Fel: {result.error}</p>
                  </div>
                ) : result.url ? (
                  <img 
                    src={result.url} 
                    alt={`AI Generated Poster - ${result.promptName}`}
                    className="w-full rounded-lg shadow-md"
                  />
                ) : (
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Ingen bild genererad</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Detta är låg-kvalitets förhandsvisningar i {getStyleDisplayName(style)}-stil. Jämför resultaten för att se vilken prompt som bevarar likheten bäst!
          </p>
        </div>
      )}
    </main>
  );
}