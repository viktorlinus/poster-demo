import { RefObject } from 'react';

interface CanvasPreviewProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canvasKey: string;
}

export default function CanvasPreview({ canvasRef, canvasKey }: CanvasPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Text kan översättas */}
      <div className="hidden lg:block mb-3">
        <h2 className="text-xl font-bold text-gray-900">Förhandsvisning</h2>
        <p className="text-sm text-gray-600">Vattenstämplar tas bort efter köp</p>
      </div>
      
      {/* Mobile title */}
      <div className="lg:hidden mb-3">
        <h2 className="text-lg font-bold text-gray-900">Din poster</h2>
      </div>
      
      <div className="flex justify-center">
        {/* Skydda bara canvas-containern */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white relative" style={{ maxWidth: '350px' }} translate="no">
          <canvas 
            ref={canvasRef}
            key={canvasKey}
            className="w-full h-auto"
            translate="no"
            data-notranslate="true"
          />
          {/* Extra skydd - HTML overlay */}
          <div className="absolute inset-0 pointer-events-none select-none bg-transparent"></div>
        </div>
      </div>
    </div>
  );
}
