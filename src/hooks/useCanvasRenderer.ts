import { useEffect, useRef, useState } from 'react';
import { PosterFormat, getDefaultFormat } from '@/lib/posterFormats';
import { calculateImageAdaptation, AdaptationMode } from '@/lib/imageAdaptation';

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
  imageVerticalPosition: number;
  textSpacing: number;
  backgroundColor: string;
  showText: boolean;
  textVerticalPosition: number;
  fontsLoaded: boolean;
  posterFormat?: PosterFormat;
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
  imageVerticalPosition,
  textSpacing,
  backgroundColor,
  showText,
  textVerticalPosition,
  fontsLoaded,
  posterFormat = getDefaultFormat()
}: UseCanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  // Använd format-specifika dimensioner
  const canvasWidth = posterFormat.pixelDimensions.width;
  const canvasHeight = posterFormat.pixelDimensions.height;
  
  // Bestäm adaptation mode baserat på text
  const adaptationMode: AdaptationMode = showText ? 'letterbox' : 'crop';

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

  // Skydda canvas mot översättning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Förhindra översättning av canvas-elementet
      canvas.setAttribute('translate', 'no');
      canvas.setAttribute('data-notranslate', 'true');
      // Extra isolation för att skydda mot DOM-manipulering
      canvas.style.isolation = 'isolate';
      console.log('🛡️ Canvas protected from translation');
    }
  }, []);

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
    if (!canvas) {
      console.error('❌ Canvas ref inte tillgänglig');
      return;
    }

    if (!backgroundImage) {
      console.warn('⏳ Väntar på bakgrundsbild...');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Kan inte få canvas context');
      return;
    }

    console.log(`🎯 Rendering canvas: ${posterFormat.id} (${canvasWidth}x${canvasHeight})`);

    try {
      // Sätt canvas storlek FÖRST - och force re-render
      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        console.log(`🔄 Canvas dimensions updated: ${canvasWidth}x${canvasHeight}`);
      }

      // Rensa canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      console.log(`✅ Canvas cleared med ${backgroundColor}`);

      // Smart bildanpassning med VINTAGE topp-marginal logik
      let adaptation = calculateImageAdaptation(
        backgroundImage.naturalWidth,
        backgroundImage.naturalHeight,
        canvasWidth,
        canvasHeight,
        adaptationMode
      );
      
      // Applicera imageScale på adaptation resultatet
      const effectiveImageScale = showText ? imageScale : 1.0;
      
      if (effectiveImageScale !== 1.0) {
        const scaleOffsetX = (adaptation.imageWidth * (1 - effectiveImageScale)) / 2;
        const scaleOffsetY = (adaptation.imageHeight * (1 - effectiveImageScale)) / 2;
        
        adaptation = {
          ...adaptation,
          imageX: adaptation.imageX + scaleOffsetX,
          imageY: adaptation.imageY + scaleOffsetY,
          imageWidth: adaptation.imageWidth * effectiveImageScale,
          imageHeight: adaptation.imageHeight * effectiveImageScale
        };
      }
      
      // FÖRBÄTTRAD VINTAGE LOGIC: Använd imageVerticalPosition för flexibel bildplacering
      if (showText && adaptationMode === 'letterbox') {
        const availableSpace = canvasHeight - adaptation.imageHeight;
        const customImageY = availableSpace * imageVerticalPosition;
        
        adaptation = {
          ...adaptation,
          imageY: customImageY
        };
        
        console.log(`🎨 Custom image position: ${imageVerticalPosition} → Y: ${customImageY}px (available: ${availableSpace}px)`);
      }
      

      
      // Rita bakgrundsbild med smart anpassning
      ctx.drawImage(
        backgroundImage, 
        adaptation.imageX, 
        adaptation.imageY, 
        adaptation.imageWidth, 
        adaptation.imageHeight
      );


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
        // VINTAGE LOGIC: Text placeras alltid under bilden med fast topp-marginal
        const textAreaStartY = adaptation.imageY + adaptation.imageHeight + 20;
        const textAreaHeight = canvasHeight - textAreaStartY - 20;
        

        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const nameY = textAreaStartY + (textAreaHeight * textVerticalPosition);

        // Rita namn - hantera tom font under re-render
        if (fontsLoaded && selectedFont) {
          const nameFontString = getCanvasFont(selectedFont, nameSize, true);
          ctx.font = nameFontString;
          console.log(`✍️ Drawing name "${petName}" with font: ${nameFontString}`);
        } else {
          ctx.font = `bold ${nameSize}px serif`;
          console.log(`⏳ Drawing name "${petName}" with fallback: bold ${nameSize}px serif`);
        }
        
        ctx.fillStyle = textColor;
        ctx.fillText(petName, canvasWidth / 2, nameY);

        // Rita memorial text - hantera tom font under re-render
        if (fontsLoaded && memorialFont) {
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
      
      console.log('🎉 Canvas rendered successfully!');
      
    } catch (error) {
      console.error('❌ Canvas rendering error:', error);
    }

  }, [backgroundImage, petName, memorialText, selectedFont, memorialFont, nameSize, textSize, textColor, memorialColor, imageScale, imageVerticalPosition, textSpacing, backgroundColor, showText, textVerticalPosition, fontsLoaded, canvasWidth, canvasHeight, posterFormat, adaptationMode]);

  // Clean canvas för checkout - UTAN VATTENSTÄMPLAR!
  const createCleanCanvas = () => {
    if (!backgroundImage) {
      console.error('🚫 createCleanCanvas: No background image available');
      return null;
    }

    console.log('🧼 Creating CLEAN canvas without watermarks...');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      console.error('🚫 createCleanCanvas: Could not get context');
      return null;
    }

    // Clear background
    tempCtx.fillStyle = backgroundColor;
    tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    console.log('✅ Clean canvas: Background filled');

    // Smart anpassning med VINTAGE topp-marginal logik för clean canvas
    let adaptation = calculateImageAdaptation(
      backgroundImage.naturalWidth,
      backgroundImage.naturalHeight,
      canvasWidth,
      canvasHeight,
      adaptationMode
    );
    
    // Applicera imageScale på clean canvas också
    const effectiveImageScale = showText ? imageScale : 1.0;
    
    if (effectiveImageScale !== 1.0) {
      const scaleOffsetX = (adaptation.imageWidth * (1 - effectiveImageScale)) / 2;
      const scaleOffsetY = (adaptation.imageHeight * (1 - effectiveImageScale)) / 2;
      
      adaptation = {
        ...adaptation,
        imageX: adaptation.imageX + scaleOffsetX,
        imageY: adaptation.imageY + scaleOffsetY,
        imageWidth: adaptation.imageWidth * effectiveImageScale,
        imageHeight: adaptation.imageHeight * effectiveImageScale
      };
    }
    
    // FÖRBÄTTRAD LOGIC för clean canvas också
    if (showText && adaptationMode === 'letterbox') {
      const availableSpace = canvasHeight - adaptation.imageHeight;
      const customImageY = availableSpace * imageVerticalPosition;
      
      adaptation = {
        ...adaptation,
        imageY: customImageY
      };
    }
    
    // Rita bakgrundsbild UTAN vattenstämplar
    tempCtx.drawImage(
      backgroundImage, 
      adaptation.imageX, 
      adaptation.imageY, 
      adaptation.imageWidth, 
      adaptation.imageHeight
    );
    console.log('✅ Clean canvas: Background image drawn');

    // Rita text om aktiverad - UTAN vattenstämplar
    if (showText) {
      console.log('✅ Clean canvas: Adding text...');
      // VINTAGE LOGIC för clean canvas
      const textAreaStartY = adaptation.imageY + adaptation.imageHeight + 20;
      const textAreaHeight = canvasHeight - textAreaStartY - 20;
      
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';

      const nameY = textAreaStartY + (textAreaHeight * textVerticalPosition);
      
      // Clean version med robust font-hantering
      if (fontsLoaded && selectedFont) {
        tempCtx.font = getCanvasFont(selectedFont, nameSize, true);
      } else {
        tempCtx.font = `bold ${nameSize}px serif`;
      }
      tempCtx.fillStyle = textColor;
      tempCtx.fillText(petName, canvasWidth / 2, nameY);
      console.log(`✅ Clean canvas: Pet name "${petName}" added`);

      if (fontsLoaded && memorialFont) {
        tempCtx.font = getCanvasFont(memorialFont, textSize, false);
      } else {
        tempCtx.font = `${textSize}px sans-serif`;
      }
      tempCtx.fillStyle = memorialColor;
      const memorialY = nameY + (nameSize * 0.3) + textSpacing;
      tempCtx.fillText(memorialText, canvasWidth / 2, memorialY);
      console.log(`✅ Clean canvas: Memorial text "${memorialText}" added`);
    }

    // 🚨 VIKTIGT: INGA VATTENSTÄMPLAR HÄR!
    // Gamla koden hade samma vattenstämplar som huvudcanvas - det var felet!
    
    const cleanDataUrl = tempCanvas.toDataURL('image/png', 1.0);
    console.log('🎉 Clean canvas created successfully - NO WATERMARKS!');
    console.log('📏 Clean canvas size:', cleanDataUrl.length, 'characters');
    
    return cleanDataUrl;
  };

  return {
    canvasRef,
    canvasWidth,
    canvasHeight,
    createCleanCanvas,
    canvasKey: `${posterFormat.id}-${canvasWidth}x${canvasHeight}` // För att force re-render
  };
}
