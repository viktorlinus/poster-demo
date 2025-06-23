import { useEffect, useRef, useState } from 'react';

interface UseCanvasRendererProps {
  backgroundImageUrl: string;
  petName: string;
  memorialText: string;
  selectedFont: string;
  memorialFont: string;
  nameSize: number;
  textSize: number;
  textColor: string;
  memorialColor: string;
  imageScale: number;
  textSpacing: number;
  backgroundColor: string;
  showText: boolean;
  textVerticalPosition: number;
  fontsLoaded: boolean;
}

export function useCanvasRenderer({
  backgroundImageUrl,
  petName,
  memorialText,
  selectedFont,
  memorialFont,
  nameSize,
  textSize,
  textColor,
  memorialColor,
  imageScale,
  textSpacing,
  backgroundColor,
  showText,
  textVerticalPosition,
  fontsLoaded
}: UseCanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const canvasWidth = 1024;
  const canvasHeight = 1536;

  // Enklare font-hantering
  const getCanvasFont = (fontName: string, size: number, bold = false) => {
    const weight = bold ? 'bold ' : '';
    
    // ALLTID använd citationstecken runt fontnamn med mellanslag
    const quotedFontName = fontName.includes(' ') ? `"${fontName}"` : fontName;
    
    let fallback = 'serif';
    if (fontName === 'Great Vibes' || fontName === 'Dancing Script') {
      fallback = 'cursive';
    } else if (fontName === 'Montserrat') {
      fallback = 'sans-serif';
    }
    
    const fontString = `${weight}${size}px ${quotedFontName}, ${fallback}`;
    console.log(`🎨 Canvas font: "${fontName}" → "${fontString}"`);
    return fontString;
  };

  // Ladda bakgrundsbild
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setBackgroundImage(img);
    img.src = backgroundImageUrl;
  }, [backgroundImageUrl]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log(`🖼️ Rendering canvas - Fonts loaded: ${fontsLoaded}, Name font: ${selectedFont}, Memorial font: ${memorialFont}`);

    // Rensa canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Bildstorlek
    const effectiveImageScale = showText ? imageScale : 1.0;
    const scaledWidth = canvasWidth * effectiveImageScale;
    const scaledHeight = canvasHeight * effectiveImageScale;
    const sideMargin = (canvasWidth - scaledWidth) / 2;
    const imageX = sideMargin;
    const imageY = showText ? sideMargin * 0.7 : sideMargin;
    
    // Rita bakgrundsbild
    ctx.drawImage(backgroundImage, imageX, imageY, scaledWidth, scaledHeight);

    // VATTENSTÄMPLAR
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.rotate(-Math.PI / 6);

    for (let y = -200; y < canvasHeight + 200; y += 200) {
      for (let x = -200; x < canvasWidth + 200; x += 300) {
        ctx.fillText('PREVIEW', x, y);
      }
    }
    ctx.restore();

    // Logga overlay
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🐾 Pet Memories', canvasWidth / 2, canvasHeight / 2);
    ctx.fillText('Köp för full kvalitet', canvasWidth / 2, canvasHeight / 2 + 40);
    ctx.restore();

    // Rita text om aktiverad
    if (showText) {
      const textAreaStartY = imageY + scaledHeight + 20;
      const textAreaHeight = canvasHeight - textAreaStartY - 20;
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const nameY = textAreaStartY + (textAreaHeight * textVerticalPosition);

      // Rita namn
      if (fontsLoaded) {
        const nameFontString = getCanvasFont(selectedFont, nameSize, true);
        ctx.font = nameFontString;
        console.log(`✍️ Drawing name "${petName}" with font: ${nameFontString}`);
      } else {
        ctx.font = `bold ${nameSize}px serif`;
        console.log(`⏳ Drawing name "${petName}" with fallback: bold ${nameSize}px serif`);
      }
      
      ctx.fillStyle = textColor;
      ctx.fillText(petName, canvasWidth / 2, nameY);

      // Rita memorial text
      if (fontsLoaded) {
        const memorialFontString = getCanvasFont(memorialFont, textSize, false);
        ctx.font = memorialFontString;
        console.log(`✍️ Drawing memorial "${memorialText}" with font: ${memorialFontString}`);
      } else {
        ctx.font = `${textSize}px sans-serif`;
        console.log(`⏳ Drawing memorial "${memorialText}" with fallback: ${textSize}px sans-serif`);
      }
      
      ctx.fillStyle = memorialColor;
      const memorialY = nameY + (nameSize * 0.3) + textSpacing;
      ctx.fillText(memorialText, canvasWidth / 2, memorialY);
    }

  }, [backgroundImage, petName, memorialText, selectedFont, memorialFont, nameSize, textSize, textColor, memorialColor, imageScale, textSpacing, backgroundColor, showText, textVerticalPosition, fontsLoaded]);

  // Clean canvas för checkout
  const createCleanCanvas = () => {
    if (!backgroundImage) return null;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return null;

    tempCtx.fillStyle = backgroundColor;
    tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    const effectiveImageScale = showText ? imageScale : 1.0;
    const scaledWidth = canvasWidth * effectiveImageScale;
    const scaledHeight = canvasHeight * effectiveImageScale;
    const sideMargin = (canvasWidth - scaledWidth) / 2;
    const imageX = sideMargin;
    const imageY = showText ? sideMargin * 0.7 : sideMargin;
    
    tempCtx.drawImage(backgroundImage, imageX, imageY, scaledWidth, scaledHeight);

    if (showText) {
      const textAreaStartY = imageY + scaledHeight + 20;
      const textAreaHeight = canvasHeight - textAreaStartY - 20;
      
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';

      const nameY = textAreaStartY + (textAreaHeight * textVerticalPosition);
      
      // Clean version med fonts
      tempCtx.font = getCanvasFont(selectedFont, nameSize, true);
      tempCtx.fillStyle = textColor;
      tempCtx.fillText(petName, canvasWidth / 2, nameY);

      tempCtx.font = getCanvasFont(memorialFont, textSize, false);
      tempCtx.fillStyle = memorialColor;
      const memorialY = nameY + (nameSize * 0.3) + textSpacing;
      tempCtx.fillText(memorialText, canvasWidth / 2, memorialY);
    }

    return tempCanvas.toDataURL('image/png', 1.0);
  };

  return {
    canvasRef,
    canvasWidth,
    canvasHeight,
    createCleanCanvas
  };
}
