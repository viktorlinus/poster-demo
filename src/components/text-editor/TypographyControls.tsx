interface TypographyControlsProps {
  nameSize: number;
  setNameSize: (size: number) => void;
  textSize: number;
  setTextSize: (size: number) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  memorialColor: string;
  setMemorialColor: (color: string) => void;
  textVerticalPosition: number;
  setTextVerticalPosition: (position: number) => void;
  textSpacing: number;
  setTextSpacing: (spacing: number) => void;
}

export default function TypographyControls({
  nameSize,
  setNameSize,
  textSize,
  setTextSize,
  textColor,
  setTextColor,
  memorialColor,
  setMemorialColor,
  textVerticalPosition,
  setTextVerticalPosition,
  textSpacing,
  setTextSpacing
}: TypographyControlsProps) {
  return (
    <>
      {/* Size Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Namnstorlek <span className="text-blue-600">{nameSize}px</span>
          </label>
          <input
            type="range"
            min="40"
            max="120"
            value={nameSize}
            onChange={(e) => setNameSize(Number(e.target.value))}
            className="w-full h-1"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Textstorlek <span className="text-blue-600">{textSize}px</span>
          </label>
          <input
            type="range"
            min="20"
            max="60"
            value={textSize}
            onChange={(e) => setTextSize(Number(e.target.value))}
            className="w-full h-1"
          />
        </div>
      </div>

      {/* Color Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Namnfärg</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 p-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Textfärg</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={memorialColor}
              onChange={(e) => setMemorialColor(e.target.value)}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={memorialColor}
              onChange={(e) => setMemorialColor(e.target.value)}
              className="flex-1 p-1 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>
      </div>

      {/* Position Controls */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Textposition: {textVerticalPosition === 0 ? 'Topp' : textVerticalPosition === 0.5 ? 'Mitten' : textVerticalPosition === 1 ? 'Botten' : Math.round(textVerticalPosition * 100) + '%'}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={textVerticalPosition}
          onChange={(e) => setTextVerticalPosition(Number(e.target.value))}
          className="w-full h-1"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Textavstånd <span className="text-blue-600">{textSpacing}px</span>
        </label>
        <input
          type="range"
          min="0"
          max="60"
          value={textSpacing}
          onChange={(e) => setTextSpacing(Number(e.target.value))}
          className="w-full h-1"
        />
      </div>
    </>
  );
}
