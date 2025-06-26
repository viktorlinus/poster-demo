'use client';
import { useState } from 'react';
import { getStripe } from '@/lib/stripe';
import { PosterFormat, getDefaultFormat } from '@/lib/posterFormats';

// Hooks
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
import { useImageProtection } from '@/hooks/useImageProtection';
import { useGoogleFonts } from '@/hooks/useGoogleFonts';

// Components
import TextToggle from './text-editor/TextToggle';
import TextContent from './text-editor/TextContent';
import ColorControls from './text-editor/ColorControls';
import LayoutControls from './text-editor/LayoutControls';
import PricingControls from './text-editor/PricingControls';
import CanvasPreview from './text-editor/CanvasPreview';
import FormatSelector from './text-editor/FormatSelector';

interface TextEditorProps {
  backgroundImageUrl: string;
  onCancel: () => void;
  style?: string;
}

export default function TextEditor({ backgroundImageUrl, onCancel, style }: TextEditorProps) {
  // Text content state
  const [petName, setPetName] = useState('Bella');
  const [memorialText, setMemorialText] = useState('2019 - 2024 • Vårt älskade husdjur');
  const [showText, setShowText] = useState(true);
  
  // Typography state - SEPARATA FONTS
  const [selectedFont, setSelectedFont] = useState('Alex Brush');
  const [memorialFont, setMemorialFont] = useState('Merriweather'); // Separat font för minnestext
  const [nameSize, setNameSize] = useState(110);
  const [textSize, setTextSize] = useState(46);
  const [textColor, setTextColor] = useState('#2d3748');
  const [memorialColor, setMemorialColor] = useState('#4a5568');
  
  // Layout state
  const [imageScale, setImageScale] = useState(0.75);
  const [imageVerticalPosition, setImageVerticalPosition] = useState(0.3); // Default 30% från toppen
  const [textSpacing, setTextSpacing] = useState(60);
  const [textVerticalPosition, setTextVerticalPosition] = useState(0.3);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  
  // Format state
  const [selectedFormat, setSelectedFormat] = useState<PosterFormat>(getDefaultFormat());
  
  // App state
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fonts = [
    // Script/Handwriting (för namn)
    'Great Vibes',
    'Dancing Script', 
    'Allura',
    'Satisfy',
    'Pacifico',
    'Kaushan Script',
    'Alex Brush',
    
    // Elegant Serif (för namn eller text)
    'Playfair Display',
    'Cormorant Garamond',
    'Crimson Text',
    'EB Garamond',
    'Libre Baskerville',
    'Merriweather',
    
    // Modern Sans-Serif (för text)
    'Montserrat',
    'Open Sans',
    'Lato',
    'Poppins',
    'Source Sans Pro'
  ];

  // Custom hooks - pass båda fonterna
  const fontsLoaded = useGoogleFonts(selectedFont, memorialFont, setSelectedFont);
  
  const { canvasRef, createCleanCanvas, canvasKey } = useCanvasRenderer({
    backgroundImageUrl,
    petName,
    memorialText,
    selectedFont,
    memorialFont, // Ny parameter
    nameSize,
    textSize,
    textColor,
    memorialColor,
    imageScale,
    imageVerticalPosition, // Ny parameter
    textSpacing,
    backgroundColor,
    showText,
    textVerticalPosition,
    fontsLoaded,
    posterFormat: selectedFormat // Ny parameter
  });

  useImageProtection(canvasRef);

  // Checkout handler
  const handleCheckout = async (tier: 'digital' | 'print') => {
    setIsCheckingOut(true);
    
    try {
      const posterDataUrl = createCleanCanvas();
      if (!posterDataUrl) {
        throw new Error('Kunde inte skapa poster');
      }
      
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          posterDataUrl,
          metadata: {
            petName: showText && petName.trim() && petName.trim() !== 'Bella' ? petName.trim() : '',
            style: style || 'watercolor',
            hasText: showText && petName.trim().length > 0 && petName.trim() !== 'Bella',
            format: selectedFormat.id,
            dimensions: selectedFormat.dimensions
          }
        })
      });
      
      const { sessionId } = await res.json();
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Något gick fel vid checkout. Försök igen.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm p-3 lg:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Anpassa poster</h1>
          <button 
            onClick={onCancel}
            className="text-gray-600 text-sm px-3 py-1 rounded bg-gray-100"
          >
            ← Tillbaka
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 lg:p-6">
        <div className="grid lg:grid-cols-5 gap-4">
          
          {/* Canvas - Visas FÖRST på mobil */}
          <div className="lg:col-span-3 order-1">
            <CanvasPreview 
              canvasRef={canvasRef}
              canvasKey={canvasKey}
            />
          </div>

          {/* Controls - Visas EFTER bilden på mobil */}
          <div className="lg:col-span-2 order-2">
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-6">
              
              <FormatSelector 
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                hasText={showText}
              />
              
              <TextToggle showText={showText} setShowText={setShowText} />

              {showText && (
                <>
                  <TextContent
                    petName={petName}
                    setPetName={setPetName}
                    memorialText={memorialText}
                    setMemorialText={setMemorialText}
                    selectedFont={selectedFont}
                    setSelectedFont={setSelectedFont}
                    memorialFont={memorialFont}
                    setMemorialFont={setMemorialFont}
                    fonts={fonts}
                    textSpacing={textSpacing}
                    setTextSpacing={setTextSpacing}
                    textVerticalPosition={textVerticalPosition}
                    setTextVerticalPosition={setTextVerticalPosition}
                    nameSize={nameSize}
                    setNameSize={setNameSize}
                    textSize={textSize}
                    setTextSize={setTextSize}
                  />

                  <ColorControls
                    textColor={textColor}
                    setTextColor={setTextColor}
                    memorialColor={memorialColor}
                    setMemorialColor={setMemorialColor}
                  />

                  <LayoutControls
                    imageScale={imageScale}
                    setImageScale={setImageScale}
                    imageVerticalPosition={imageVerticalPosition}
                    setImageVerticalPosition={setImageVerticalPosition}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColor}
                    showText={showText}
                  />
                </>
              )}

              <PricingControls
                isCheckingOut={isCheckingOut}
                onCheckout={handleCheckout}
                onCancel={onCancel}
                selectedFormat={selectedFormat}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
