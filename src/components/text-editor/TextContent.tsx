import { useState } from 'react';

interface TextContentProps {
  petName: string;
  setPetName: (name: string) => void;
  memorialText: string;
  setMemorialText: (text: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  memorialFont: string;
  setMemorialFont: (font: string) => void;
  fonts: string[];
  textSpacing: number;
  setTextSpacing: (spacing: number) => void;
  textVerticalPosition: number;
  setTextVerticalPosition: (position: number) => void;
  nameSize: number;
  setNameSize: (size: number) => void;
  textSize: number;
  setTextSize: (size: number) => void;
}

export default function TextContent({ 
  petName, 
  setPetName, 
  memorialText, 
  setMemorialText,
  selectedFont,
  setSelectedFont,
  memorialFont,
  setMemorialFont,
  fonts,
  textSpacing,
  setTextSpacing,
  textVerticalPosition,
  setTextVerticalPosition,
  nameSize,
  setNameSize,
  textSize,
  setTextSize
}: TextContentProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">📝 Text</h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {showAdvanced ? '▼ Dölj avancerat' : '▶ Avancerat'}
        </button>
      </div>

      {/* Vanligaste kontroller - ALLTID SYNLIGA */}
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Namn</label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 focus:ring-1 focus:ring-blue-500"
            placeholder="Bella"
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Minnestext</label>
          <textarea
            value={memorialText}
            onChange={(e) => setMemorialText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 focus:ring-1 focus:ring-blue-500"
            rows={2}
            placeholder="2019 - 2024 • Vårt älskade husdjur"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Font</label>
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
          >
            {fonts.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Textstorlekar - VANLIGA KONTROLLER */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Namnstorlek</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="40"
                max="200"
                value={nameSize}
                onChange={(e) => setNameSize(Number(e.target.value))}
                className="flex-1 h-1"
              />
              <span className="text-xs font-medium text-blue-600 w-10 text-right">
                {nameSize}px
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Textstorlek</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="20"
                max="100"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="flex-1 h-1"
              />
              <span className="text-xs font-medium text-blue-600 w-10 text-right">
                {textSize}px
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Avancerade kontroller - DÖLJS SOM DEFAULT */}
      {showAdvanced && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          {/* Radavstånd och Textposition på samma rad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Radavstånd</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={textSpacing}
                  onChange={(e) => setTextSpacing(Number(e.target.value))}
                  className="flex-1 h-1"
                />
                <span className="text-xs font-medium text-blue-600 w-10 text-right">
                  {textSpacing}px
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Textposition</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={textVerticalPosition}
                  onChange={(e) => setTextVerticalPosition(Number(e.target.value))}
                  className="flex-1 h-1"
                />
                <span className="text-xs font-medium text-blue-600 w-10 text-right">
                  {textVerticalPosition === 0 ? 'Topp' : textVerticalPosition === 0.5 ? 'Mitten' : textVerticalPosition === 1 ? 'Botten' : Math.round(textVerticalPosition * 100) + '%'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Minnestextfont</label>
            <select
              value={memorialFont}
              onChange={(e) => setMemorialFont(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
            >
              {fonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
