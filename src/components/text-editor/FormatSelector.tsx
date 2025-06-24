// components/text-editor/FormatSelector.tsx
'use client';
import { POSTER_FORMATS, PosterFormat } from '@/lib/posterFormats';

interface FormatSelectorProps {
  selectedFormat: PosterFormat;
  onFormatChange: (format: PosterFormat) => void;
  hasText: boolean;
}

export default function FormatSelector({ selectedFormat, onFormatChange, hasText }: FormatSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        📐 Poster Storlek
      </label>
      
      <select 
        value={selectedFormat.id}
        onChange={(e) => {
          const format = POSTER_FORMATS.find(f => f.id === e.target.value);
          if (format) onFormatChange(format);
        }}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm"
      >
        {POSTER_FORMATS.map(format => (
          <option key={format.id} value={format.id}>
            {format.label}
            {format.priceModifier && format.priceModifier > 0 && ` (+${format.priceModifier}kr)`}
          </option>
        ))}
      </select>
      
      {/* Info baserat på valt format */}
      <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
        <strong>{selectedFormat.label}</strong><br/>
        {hasText ? (
          <>📝 Text mode: Hela bilden visas + text i marginaler</>
        ) : (
          <>🖼️ Bild mode: Fyller hela ramen, beskär lite från kanterna</>
        )}
        {selectedFormat.ikea && <><br/>📐 IKEA-kompatibel storlek</>}
        {selectedFormat.popular && <><br/>⭐ Populärast val</>}
      </div>
    </div>
  );
}
