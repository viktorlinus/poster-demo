interface ColorControlsProps {
  textColor: string;
  setTextColor: (color: string) => void;
  memorialColor: string;
  setMemorialColor: (color: string) => void;
}

export default function ColorControls({
  textColor,
  setTextColor,
  memorialColor,
  setMemorialColor
}: ColorControlsProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">🎨 Färger</h3>
      </div>

      {/* FÄRG SWATCHES */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Namnfärg</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Textfärg</label>
          <input
            type="color"
            value={memorialColor}
            onChange={(e) => setMemorialColor(e.target.value)}
            className="w-full h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
