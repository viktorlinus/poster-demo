'use client';
import { useEffect, useRef, useState } from 'react';
import { upscaleImage } from '@/lib/upscale';

interface TextEditorProps {
  backgroundImageUrl: string;
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export default function TextEditor({ backgroundImageUrl, onSave, onCancel }: TextEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [petName, setPetName] = useState('Bella');
  const [memorialText, setMemorialText] = useState('2019 - 2024 • Vårt älskade husdjur');
  const [selectedFont, setSelectedFont] = useState('Great Vibes');
  const [nameSize, setNameSize] = useState(80);
  const [textSize, setTextSize] = useState(32);
  const [textColor, setTextColor] = useState('#2d3748');
  const [memorialColor, setMemorialColor] = useState('#4a5568');
  const [imageScale, setImageScale] = useState(0.75); // Lämna 25% plats för text
  const [textSpacing, setTextSpacing] = useState(20); // Avstånd mellan texterna
  const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Bakgrundsfärg
  const [upscaling, setUpscaling] = useState(false);
  const [upscaledBackgroundUrl, setUpscaledBackgroundUrl] = useState<string | null>(null);

  const canvasWidth = 1024;
  const canvasHeight = 1536;

  // Fonter som passar temat
  const fonts = [
    'Great Vibes',      // Script/handwriting (Google Font)
    'Playfair Display', // Elegant serif (Google Font)
    'Dancing Script',   // Casual script (Google Font)
    'Montserrat',       // Modern sans (Google Font)
    'Cormorant Garamond', // Classic serif (Google Font)
    'Georgia',          // Fallback serif
    'Arial',            // Fallback sans
  ];

  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  // Hantera upscaling av bakgrundsbild
  const handleUpscaleBackground = async () => {
    setUpscaling(true);
    
    try {
      const upscaledUrl = await upscaleImage(backgroundImageUrl);
      setUpscaledBackgroundUrl(upscaledUrl);
      alert('Bakgrundsbild uppskalad till 4x kvalitet! ✨');
    } catch (error) {
      console.error('Upscaling error:', error);
      alert('Uppskalning misslyckades. Försök igen.');
    } finally {
      setUpscaling(false);
    }
  };

  // Använd upscaled version om den finns
  const currentBackgroundUrl = upscaledBackgroundUrl || backgroundImageUrl;

  // Ladda Google Fonts dynamiskt
  useEffect(() => {
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap'
    ];
    
    fontLinks.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Vänta lite för att Google Fonts ska laddas
    setTimeout(() => {
      // Trigga en re-render när fonts är laddade
      setSelectedFont(prev => prev);
    }, 1500);
  }, []);

  // Ladda bakgrundsbild
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setBackgroundImage(img);
    };
    img.src = currentBackgroundUrl;
  }, [currentBackgroundUrl]);

  // Rita canvas när något ändras
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rensa canvas med vald bakgrundsfärg
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Beräkna bildens proportionella storlek
    const scaledWidth = canvasWidth * imageScale;
    const scaledHeight = canvasHeight * imageScale;
    
    // Sido-marginalen blir automatiskt (canvasWidth - scaledWidth) / 2
    const sideMargin = (canvasWidth - scaledWidth) / 2;
    
    // Använd 70% av sido-marginalen i toppen
    const imageX = sideMargin;
    const imageY = sideMargin * 0.7; // 70% av sido-marginalen
    
    // Rita bakgrundsbild (med jämn marginal top och sides)
    ctx.drawImage(backgroundImage, imageX, imageY, scaledWidth, scaledHeight);

    // Text-område är efter bilden + marginal
    const textAreaStartY = imageY + scaledHeight + 20; // 20px mellanrum
    const textAreaEndY = canvasHeight;
    const textAreaHeight = textAreaEndY - textAreaStartY;
    
    // Text-inställningar
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Rita husdjurets namn
    // Använd fallback-font om Google Font inte är laddad
    const nameFont = selectedFont.includes(' ') ? `"${selectedFont}", serif` : `${selectedFont}, serif`;
    ctx.font = `bold ${nameSize}px ${nameFont}`;
    ctx.fillStyle = textColor;
    const nameY = textAreaStartY + textAreaHeight * 0.3;
    ctx.fillText(petName, canvasWidth / 2, nameY);

    // Rita memorial text
    const memorialFont = selectedFont === 'Great Vibes' ? 'Montserrat, sans-serif' : nameFont;
    ctx.font = `${textSize}px ${memorialFont}`;
    ctx.fillStyle = memorialColor;
    // Räkna från baslinjen av namnet, inte från fontstorleken
    const memorialY = nameY + (nameSize * 0.3) + textSpacing; // 0.3 är ungefär descent av fonten
    ctx.fillText(memorialText, canvasWidth / 2, memorialY);

  }, [backgroundImage, petName, memorialText, selectedFont, nameSize, textSize, textColor, memorialColor, imageScale, textSpacing, backgroundColor]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Exportera som PNG med hög kvalitet
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    onSave(dataUrl);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    
    // Skapa download-länk
    const link = document.createElement('a');
    link.download = `${petName.toLowerCase()}-memorial-poster.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-8">
        {/* Canvas */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Anpassa din poster</h2>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ maxWidth: '512px' }}>
            <canvas 
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Kontroller */}
        <div className="w-80 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Husdjurets namn
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Skriv namn här..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Memorial text
            </label>
            <textarea
              value={memorialText}
              onChange={(e) => setMemorialText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="2019 - 2024 • Vårt älskade husdjur"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Typsnitt
            </label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {fonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Namnstorlek: {nameSize}px
            </label>
            <input
              type="range"
              min="40"
              max="120"
              value={nameSize}
              onChange={(e) => setNameSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Textstorlek: {textSize}px
            </label>
            <input
              type="range"
              min="20"
              max="60"
              value={textSize}
              onChange={(e) => setTextSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Bildstorlek: {Math.round(imageScale * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="0.9"
              step="0.05"
              value={imageScale}
              onChange={(e) => setImageScale(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Lägre värde = mer plats för text</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Namnfärg
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
                placeholder="#2d3748"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Memorial textfärg
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={memorialColor}
                onChange={(e) => setMemorialColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={memorialColor}
                onChange={(e) => setMemorialColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
                placeholder="#4a5568"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Textavstånd: {textSpacing}px
            </label>
            <input
              type="range"
              min="0"
              max="60"
              value={textSpacing}
              onChange={(e) => setTextSpacing(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Avstånd mellan namn och memorial text</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Bakgrundsfärg
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
                placeholder="#ffffff"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setBackgroundColor('#ffffff')}
                className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Vit
              </button>
              <button
                onClick={() => setBackgroundColor('#f8f9fa')}
                className="px-3 py-1 text-xs bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                Ljusgrå
              </button>
              <button
                onClick={() => setBackgroundColor('#f5f5dc')}
                className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                style={{ backgroundColor: '#f5f5dc' }}
              >
                Beige
              </button>
            </div>
          </div>

          {/* Bakgrundsbild upscaling */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-bold text-purple-800 mb-2">🚀 Förbättra bildkvalitet</h4>
            <p className="text-sm text-purple-700 mb-3">
              {upscaledBackgroundUrl 
                ? "Bakgrundsbild har uppskalats till 4x kvalitet!" 
                : "Upskala bakgrundsbilden för bättre print-kvalitet"
              }
            </p>
            {!upscaledBackgroundUrl && (
              <button
                onClick={handleUpscaleBackground}
                disabled={upscaling}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {upscaling ? 'Uppskalerar... (30-60s)' : '🚀 Upskala bakgrundsbild'}
              </button>
            )}
          </div>

          {/* Knappar */}
          <div className="space-y-3">
            <button
              onClick={downloadImage}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 font-medium"
            >
              📥 Ladda ner poster
              {upscaledBackgroundUrl && (
                <span className="ml-2 text-xs">(4x kvalitet)</span>
              )}
            </button>
            
            <button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 font-medium"
            >
              💾 Spara & fortsätt
            </button>
            
            <button
              onClick={onCancel}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 font-medium"
            >
              ⬅️ Tillbaka till bilder
            </button>
          </div>

          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg">
            <h4 className="font-bold text-green-800 mb-2">✅ ENKEL LÖSNING</h4>
            <p className="text-sm text-green-700">
              Vanilla HTML5 Canvas - inga bibliotek, inga versionsproblem, bara ren JavaScript som fungerar överallt!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}