interface TextToggleProps {
  showText: boolean;
  setShowText: (show: boolean) => void;
}

export default function TextToggle({ showText, setShowText }: TextToggleProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900 text-sm">Text på/av</h3>
          <p className="text-xs text-gray-600">
            {showText ? 'Anpassa text' : 'Bara AI-konst'}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showText}
            onChange={(e) => setShowText(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
}
