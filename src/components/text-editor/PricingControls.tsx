import { PosterFormat } from '@/lib/posterFormats';

interface PricingControlsProps {
  isCheckingOut: boolean;
  onCheckout: (tier: 'digital' | 'print') => void;
  onCancel: () => void;
  selectedFormat: PosterFormat;
}

export default function PricingControls({ isCheckingOut, onCheckout, onCancel, selectedFormat }: PricingControlsProps) {
  // Beräkna priser baserat på format
  const basePriceDigital = 79;
  const basePricePrint = 299;
  
  const digitalPrice = basePriceDigital; // Digital pris är alltid 79kr oavsett storlek
  const printPrice = basePricePrint + (selectedFormat.priceModifier || 0);
  return (
    <div className="border-t pt-4 space-y-3">
      <h4 className="font-medium text-sm text-gray-900">💳 Köp poster</h4>
      
      {/* Digital - Kompakt */}
      <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h5 className="font-medium text-blue-900 text-sm">Digital</h5>
            <p className="text-xs text-blue-700">Högupplöst fil • {selectedFormat.label.split(' ')[0]}</p>
          </div>
          <div className="text-lg font-bold text-blue-900">{digitalPrice}kr</div>
        </div>
        <button
          onClick={() => onCheckout('digital')}
          disabled={isCheckingOut}
          className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isCheckingOut ? '⏳ Köper...' : '💾 Köp Digital'}
        </button>
      </div>

      {/* Print - Kompakt */}
      <div className="border border-green-200 rounded-lg p-3 bg-green-50 relative">
        <div className="absolute -top-1 right-2 bg-green-600 text-white text-xs px-1 py-0.5 rounded">
          Populär
        </div>
        <div className="flex justify-between items-center mb-2">
          <div>
            <h5 className="font-medium text-green-900 text-sm">Print + Digital</h5>
            <p className="text-xs text-green-700">{selectedFormat.dimensions.width}×{selectedFormat.dimensions.height}cm + digital fil</p>
          </div>
          <div className="text-lg font-bold text-green-900">{printPrice}kr</div>
        </div>
        <button
          onClick={() => onCheckout('print')}
          disabled={isCheckingOut}
          className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isCheckingOut ? '⏳ Köper...' : '🖨️ Köp Print'}
        </button>
      </div>

      <button
        onClick={onCancel}
        className="w-full bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors"
      >
        ← Ny AI-generering
      </button>
    </div>
  );
}
