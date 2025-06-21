'use client';
import { useState } from 'react';
import { STYLE_CONFIGS, DEFAULT_STYLE, getStyleDisplayName } from '@/lib/styles';

export default function Home() {
  const [preview, setPreview] = useState<string>();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState(DEFAULT_STYLE);



  const handleClick = async () => {
    if (!file) {
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('style', style);

    try {
      const res = await fetch('/api/preview', { 
        method: 'POST', 
        body: formData 
      });
      
      const data = await res.json();
      
      if (data.error) {
        alert(`Fel: ${data.error}`);
        return;
      }
      
      if (data.url) {
        setPreview(data.url);
      } else {
        alert('Ingen bild-URL mottagen');
      }
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
          {loading ? `Genererar ${getStyleDisplayName(style)}-poster...` : 'Förhandsgranska (gratis)'}
        </button>
      </div>

      {preview && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Din AI-genererade poster:</h2>
          <img 
            src={preview} 
            alt="AI Generated Poster"
            className="w-full border-2 border-gray-300 rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-600 mt-2">
            Detta är en låg-kvalitets förhandsvisning i {getStyleDisplayName(style)}-stil. Final poster blir högupplöst.
          </p>
        </div>
      )}
    </main>
  );
}