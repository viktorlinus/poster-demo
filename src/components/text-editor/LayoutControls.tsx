import { useState } from 'react';

interface LayoutControlsProps {
  imageScale: number;
  setImageScale: (scale: number) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  showText: boolean;
}

export default function LayoutControls({
  imageScale,
  setImageScale,
  backgroundColor,
  setBackgroundColor,
  showText
}: LayoutControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Om text är av, visa inte layout-kontroller
  if (!showText) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">🖼️ Bild & Layout</h3>
      </div>

      {/* Vanligaste kontroller */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Bildstorlek
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.5"
              max="0.9"
              step="0.05"
              value={imageScale}
              onChange={(e) => setImageScale(Number(e.target.value))}
              className="flex-1 h-1"
            />
            <span className="text-xs font-medium text-blue-600 w-10 text-right">
              {Math.round(imageScale * 100)}%
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Bakgrund</label>
          <div className="grid grid-cols-4 gap-1">
            <button 
              onClick={() => setBackgroundColor('#ffffff')} 
              className={`p-2 text-xs border rounded hover:bg-gray-50 ${
                backgroundColor === '#ffffff' ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: '#ffffff' }}
            >
              Vit
            </button>
            <button 
              onClick={() => setBackgroundColor('#f8f9fa')} 
              className={`p-2 text-xs border rounded hover:bg-gray-200 ${
                backgroundColor === '#f8f9fa' ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: '#f8f9fa' }}
            >
              Grå
            </button>
            <button 
              onClick={() => setBackgroundColor('#f5f5dc')} 
              className={`p-2 text-xs border rounded hover:bg-gray-50 ${
                backgroundColor === '#f5f5dc' ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: '#f5f5dc' }}
            >
              Beige
            </button>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 text-xs border rounded hover:bg-gray-50 ${
                showAdvanced ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            >
              Egen
            </button>
          </div>
        </div>
      </div>

      {/* Avancerade kontroller */}
      {showAdvanced && (
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Anpassad bakgrundsfärg</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 p-1 border border-gray-300 rounded text-xs"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
