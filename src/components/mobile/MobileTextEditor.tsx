'use client';
import { useState } from 'react';
import { PosterFormat, POSTER_FORMATS } from '@/lib/posterFormats';
import { businessEvents } from '@/lib/analytics';
import { getStripe } from '@/lib/stripe';

interface MobileTextEditorProps {
  // Text content state
  petName: string;
  setPetName: (name: string) => void;
  memorialText: string;
  setMemorialText: (text: string) => void;
  showText: boolean;
  setShowText: (show: boolean) => void;
  
  // Typography state
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  memorialFont: string;
  setMemorialFont: (font: string) => void;
  nameSize: number;
  setNameSize: (size: number) => void;
  textSize: number;
  setTextSize: (size: number) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  memorialColor: string;
  setMemorialColor: (color: string) => void;
  
  // Layout state
  imageScale: number;
  setImageScale: (scale: number) => void;
  imageVerticalPosition: number;
  setImageVerticalPosition: (position: number) => void;
  textSpacing: number;
  setTextSpacing: (spacing: number) => void;
  textVerticalPosition: number;
  setTextVerticalPosition: (position: number) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  
  // Format and actions
  selectedFormat: PosterFormat;
  setSelectedFormat: (format: PosterFormat) => void;
  fonts: string[];
  isCheckingOut: boolean;
  createCleanCanvas: () => string | null;
  onCancel: () => void;
  style?: string;
  
  // Canvas
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasKey: string;
}

type TabType = 'text' | 'colors' | 'layout';

export default function MobileTextEditor({
  petName, setPetName, memorialText, setMemorialText, showText, setShowText,
  selectedFont, setSelectedFont, memorialFont, setMemorialFont,
  nameSize, setNameSize, textSize, setTextSize,
  textColor, setTextColor, memorialColor, setMemorialColor,
  imageScale, setImageScale, imageVerticalPosition, setImageVerticalPosition,
  textSpacing, setTextSpacing, textVerticalPosition, setTextVerticalPosition,
  backgroundColor, setBackgroundColor,
  selectedFormat, setSelectedFormat, fonts,
  isCheckingOut, onCancel,
  canvasRef, canvasKey, createCleanCanvas, style
}: MobileTextEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [showPricing, setShowPricing] = useState(false);
  const [settingsMinimized, setSettingsMinimized] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // Beräkna priser
  const digitalPrice = 19;
  const printPrice = 299 + (selectedFormat.priceModifier || 0);

  // Checkout handler - samma som desktop
  const handleCheckout = async (tier: 'digital' | 'print') => {
    setCheckingOut(true);
    
    try {
      console.log('Mobile: Starting checkout...');
      const posterDataUrl = createCleanCanvas();
      console.log('Mobile: createCleanCanvas result:', posterDataUrl ? 'SUCCESS' : 'NULL');
      
      if (!posterDataUrl) {
        throw new Error('Kunde inte skapa poster - canvas är null');
      }
      
      console.log('Mobile: Canvas created, dataURL length:', posterDataUrl.length, 'bytes');
      console.log('Mobile: Canvas size in MB:', (posterDataUrl.length / 1024 / 1024).toFixed(2), 'MB');
      
      // Step 1: TEST - Enkelt GET request först
      console.log('Mobile: Testing simple GET request...');
      let testRes;
      try {
        testRes = await fetch('/api/debug-mobile?test=mobile', {
          method: 'GET'
        });
        console.log('Mobile: GET test result:', testRes.status);
      } catch (getError) {
        console.error('Mobile: Even GET request failed:', getError);
        throw new Error(`Grundläggande nätverksfel: ${getError instanceof Error ? getError.message : 'Okänt'}`);
      }
      
      // Step 2: Om GET funkar, testa POST med liten data först
      console.log('Mobile: Testing POST with small data...');
      let smallPostRes;
      try {
        smallPostRes = await fetch('/api/debug-mobile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            test: 'small data',
            size: 'tiny'
          })
        });
        console.log('Mobile: Small POST result:', smallPostRes.status);
      } catch (smallPostError) {
        console.error('Mobile: Small POST failed:', smallPostError);
        throw new Error(`POST-fel: ${smallPostError instanceof Error ? smallPostError.message : 'Okänt'}`);
      }
      
      // Step 3: Mobil-vänlig blob-approach istället för dataURL
      console.log('Mobile: Creating blob from canvas...');
      
      // Använd toBlob() istället för toDataURL() för mobil-kompatibilitet
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas är inte tillgänglig');
      }
      
      // Skapa blob asynkront (mobil-vänlig)
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Kunde inte skapa blob från canvas'));
          }
        }, 'image/png', 0.9); // 90% kvalitet
      });
      
      console.log('Mobile: Blob created, size:', blob.size, 'bytes');
      console.log('Mobile: Blob size in MB:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
      
      let saveImageRes;
      try {
        // Använd FormData istället för JSON för bättre mobil-kompatibilitet
        const formData = new FormData();
        formData.append('posterBlob', blob, 'poster.png');  // Blob istället för dataURL
        formData.append('metadata', JSON.stringify({
          petName: showText && petName.trim() && petName.trim() !== 'Bella' ? petName.trim() : '',
          style: style || 'watercolor',
          hasText: showText && petName.trim().length > 0 && petName.trim() !== 'Bella',
          format: selectedFormat.id,
          dimensions: selectedFormat.dimensions
        }));
        
        saveImageRes = await fetch('/api/save-temp-image', {
          method: 'POST',
          body: formData  // Ingen Content-Type header - låt browser sätta den
        });
      } catch (fetchError) {
        console.error('Mobile: Network error during fetch:', fetchError);
        throw new Error(`Nätverksfel: ${fetchError instanceof Error ? fetchError.message : 'Okänt fel'}`);
      }
      
      console.log('Mobile: Save image response status:', saveImageRes.status);
      if (!saveImageRes.ok) {
        const errorText = await saveImageRes.text();
        console.log('Mobile: Save image error response:', errorText);
        throw new Error('Kunde inte spara bild');
      }
      
      const { tempKey, orderId, fileName } = await saveImageRes.json();
      
      // Step 2: Create checkout session with image reference
      const checkoutRes = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          tempKey,
          orderId,
          fileName,
          metadata: {
            petName: showText && petName.trim() && petName.trim() !== 'Bella' ? petName.trim() : '',
            style: style || 'watercolor',
            hasText: showText && petName.trim().length > 0 && petName.trim() !== 'Bella',
            format: selectedFormat.id,
            dimensions: selectedFormat.dimensions
          }
        })
      });
      
      if (!checkoutRes.ok) {
        throw new Error('Kunde inte skapa checkout');
      }
      
      const { sessionId } = await checkoutRes.json();
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
      
    } catch (error) {
      console.error('Checkout error:', error);
      // Mer detaljerad felmeddelande för debugging
      if (error instanceof Error) {
        alert(`Checkout fel: ${error.message}`);
      } else {
        alert('Något gick fel vid checkout. Försök igen.');
      }
    } finally {
      setCheckingOut(false);
    }
  };

  const formatOptions = POSTER_FORMATS;

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Anpassa poster</h1>
          <button 
            onClick={onCancel}
            className="text-gray-600 text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
          >
            ← Tillbaka
          </button>
        </div>
      </div>

      {/* Text Toggle - Enkel och kompakt längst upp */}
      <div className="bg-white border-b p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">Text på poster</span>
          <div className="flex gap-1">
            <button
              onClick={() => {setShowText(false); setActiveTab('layout');}}
              className={`px-3 py-1 text-xs rounded-l-lg border transition-colors ${
                !showText
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Bara bild
            </button>
            <button
              onClick={() => setShowText(true)}
              className={`px-3 py-1 text-xs rounded-r-lg border transition-colors ${
                showText
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Med text
            </button>
          </div>
        </div>
      </div>

      {/* Canvas area - visa HELA postern STORT */}
      <div className="flex-1 p-1 overflow-hidden relative min-h-0">
        <div className="h-full flex items-center justify-center">
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white relative" style={{ 
            maxWidth: '95vw', 
            maxHeight: '98%',
            aspectRatio: `${selectedFormat.pixelDimensions.width} / ${selectedFormat.pixelDimensions.height}`
          }}>
            <canvas 
              ref={canvasRef}
              key={canvasKey}
              className="w-full h-full object-contain block"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation - Layout alltid synlig, Text/Färger bara när text aktiverat */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex">
          {showText && (
            <>
              <button
                onClick={() => {setActiveTab('text'); setSettingsMinimized(false);}}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                  activeTab === 'text'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Text
              </button>
              <button
                onClick={() => {setActiveTab('colors'); setSettingsMinimized(false);}}
                className={`flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
                  activeTab === 'colors'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎨 Färger
              </button>
            </>
          )}
          <button
            onClick={() => {setActiveTab('layout'); setSettingsMinimized(false);}}
            className={`${showText ? 'flex-1' : 'flex-1'} py-3 px-4 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'layout'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🖼️ Layout
          </button>
          <button
            onClick={() => setSettingsMinimized(!settingsMinimized)}
            className="px-3 py-3 text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors"
          >
            {settingsMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Tab Content - visa baserat på text-status och minimize-status */}
      {!settingsMinimized && (
        <div className="bg-white border-t max-h-64 overflow-y-auto flex-shrink-0">
          <div className="p-3 space-y-3">
            
            {/* TEXT TAB - bara när showText är true */}
            {showText && activeTab === 'text' && (
              <div className="space-y-4">
                {/* Pet name input - större på mobil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Djurets namn</label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bella"
                  />
                </div>

                {/* Memorial text - större textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Undertext</label>
                  <textarea
                    value={memorialText}
                    onChange={(e) => setMemorialText(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="2019 - 2024 • Vårt älskade husdjur"
                  />
                </div>

                {/* Font selector - större dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Namnfont</label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Memorial font selector - NYTT! */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Undertextfont</label>
                  <select
                    value={memorialFont}
                    onChange={(e) => setMemorialFont(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Text size sliders - större touch targets */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Namnstorlek: {nameSize}px
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="200"
                      value={nameSize}
                      onChange={(e) => setNameSize(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Textstorlek: {textSize}px
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={textSize}
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Textposition: {textVerticalPosition === 0 ? 'Topp' : textVerticalPosition === 0.5 ? 'Mitten' : textVerticalPosition === 1 ? 'Botten' : Math.round(textVerticalPosition * 100) + '%'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={textVerticalPosition}
                      onChange={(e) => setTextVerticalPosition(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Textavstånd: {textSpacing}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={textSpacing}
                      onChange={(e) => setTextSpacing(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COLORS TAB - bara när showText är true */}
            {showText && activeTab === 'colors' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Färginställningar</h3>
                
                {/* Color pickers - större på mobil */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Namnfärg</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-16 h-16 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg text-base"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Undertextfärg</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={memorialColor}
                        onChange={(e) => setMemorialColor(e.target.value)}
                        className="w-16 h-16 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={memorialColor}
                        onChange={(e) => setMemorialColor(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg text-base"
                        placeholder="#666666"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fördefinierade färger</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['#000000', '#ffffff', '#8B4513', '#2F4F4F', '#800080', '#FF6347'].map(color => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Background color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bakgrundsfärg</label>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-16 h-16 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg text-base"
                    />
                  </div>
                  
                  {/* Preset backgrounds */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { color: '#ffffff', label: 'Vit' },
                      { color: '#f8f9fa', label: 'Grå' },
                      { color: '#f5f5dc', label: 'Beige' },
                      { color: '#faf0e6', label: 'Linne' }
                    ].map(({ color, label }) => (
                      <button
                        key={color}
                        onClick={() => setBackgroundColor(color)}
                        className={`p-3 border rounded-lg text-xs transition-colors ${
                          backgroundColor === color
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LAYOUT TAB - alltid tillgänglig */}
            {activeTab === 'layout' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Layout & placering</h3>
                
                {/* Format selector - alltid synlig */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posterstorlek</label>
                  <div className="grid grid-cols-2 gap-2">
                    {formatOptions.map(format => (
                      <button
                        key={format.id}
                        onClick={() => setSelectedFormat(format)}
                        className={`p-3 border rounded-lg text-xs text-center transition-colors ${
                          selectedFormat.id === format.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium text-xs">{format.dimensions.width}×{format.dimensions.height}cm</div>
                        <div className="text-xs text-gray-500">+{format.priceModifier || 0}kr</div>
                        {format.popular && <div className="text-xs text-green-600">⭐ Populär</div>}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Image controls - bara när text är aktiverat */}
                {showText && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bildstorlek: {Math.round(imageScale * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="0.9"
                        step="0.05"
                        value={imageScale}
                        onChange={(e) => setImageScale(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bildposition: {imageVerticalPosition === 0 ? 'Topp' : imageVerticalPosition === 0.5 ? 'Mitten' : imageVerticalPosition === 1 ? 'Botten' : Math.round(imageVerticalPosition * 100) + '%'}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={imageVerticalPosition}
                        onChange={(e) => setImageVerticalPosition(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed köpknapp längst ner - mindre padding */}
      <div className="bg-white border-t p-3 flex-shrink-0">
        <button
          onClick={() => {
            setShowPricing(true);
            businessEvents.pricingViewed('Digital'); // Track mobile pricing viewed
          }}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors"
        >
          💳 Köp poster
        </button>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Välj ditt alternativ</h3>
              <button 
                onClick={() => setShowPricing(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {/* Digital */}
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold text-blue-900">💾 Digital</h4>
                    <p className="text-sm text-blue-700">Högupplöst fil • Instant nedladdning</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{digitalPrice}kr</div>
                </div>
                <button
                  onClick={() => handleCheckout('digital')}
                  disabled={isCheckingOut || checkingOut}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {(isCheckingOut || checkingOut) ? '⏳ Köper...' : 'Köp Digital'}
                </button>
              </div>

              {/* Print */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50 relative">
                <div className="absolute -top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Populär
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold text-green-900">🖨️ Print + Digital</h4>
                    <p className="text-sm text-green-700">
                      {selectedFormat.dimensions.width}×{selectedFormat.dimensions.height}cm • Premium tryck • + digital fil
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{printPrice}kr</div>
                </div>
                <button
                  onClick={() => handleCheckout('print')}
                  disabled={isCheckingOut || checkingOut}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {(isCheckingOut || checkingOut) ? '⏳ Köper...' : 'Köp Print'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}