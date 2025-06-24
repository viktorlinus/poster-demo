import { useEffect, useState } from 'react';

export function useGoogleFonts(selectedFont: string, memorialFont: string, setSelectedFont: (font: string) => void) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Alla Google Fonts vi använder
    const fontConfigs = [
      // Script/Handwriting
      'Great+Vibes:wght@400',
      'Dancing+Script:wght@400;700',
      'Allura:wght@400',
      'Satisfy:wght@400',
      'Pacifico:wght@400',
      'Kaushan+Script:wght@400',
      'Alex+Brush:wght@400',
      
      // Elegant Serif
      'Playfair+Display:wght@400;700',
      'Cormorant+Garamond:wght@400;700',
      'Crimson+Text:wght@400;700',
      'EB+Garamond:wght@400;700',
      'Libre+Baskerville:wght@400;700',
      'Merriweather:wght@400;700',
      
      // Modern Sans-Serif
      'Montserrat:wght@400;700',
      'Open+Sans:wght@400;700',
      'Lato:wght@400;700',
      'Poppins:wght@400;700',
      'Source+Sans+Pro:wght@400;700'
    ];

    // Ladda varje font
    fontConfigs.forEach(fontConfig => {
      const href = `https://fonts.googleapis.com/css2?family=${fontConfig}&display=swap`;
      
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => console.log(`✅ Font CSS loaded: ${fontConfig}`);
        document.head.appendChild(link);
      }
    });

    // Mycket enklare approach - bara vänta och testa
    const waitForFonts = () => {
      let attempts = 0;
      const maxAttempts = 30; // 30 sekunder max
      
      const checkFonts = () => {
        attempts++;
        
        // Testa om BÅDA default-fonterna är tillgängliga
        const testElement = document.createElement('span');
        testElement.style.fontSize = '72px';
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        testElement.style.whiteSpace = 'nowrap';
        testElement.textContent = 'Testing Font Width';
        document.body.appendChild(testElement);
        
        // Testa Alex Brush (default namn-font)
        testElement.style.fontFamily = '"Alex Brush", cursive';
        const alexBrushWidth = testElement.offsetWidth;
        
        testElement.style.fontFamily = 'cursive';
        const cursiveFallbackWidth = testElement.offsetWidth;
        
        // Testa Merriweather (default memorial-font)
        testElement.style.fontFamily = '"Merriweather", serif';
        const merriweatherWidth = testElement.offsetWidth;
        
        testElement.style.fontFamily = 'serif';
        const serifFallbackWidth = testElement.offsetWidth;
        
        document.body.removeChild(testElement);
        
        // Båda default-fonterna måste vara laddade
        const alexBrushLoaded = Math.abs(alexBrushWidth - cursiveFallbackWidth) > 5;
        const merriweatherLoaded = Math.abs(merriweatherWidth - serifFallbackWidth) > 5;
        const isLoaded = alexBrushLoaded && merriweatherLoaded;
        
        console.log(`Font check attempt ${attempts}:`, {
          alexBrush: alexBrushLoaded ? 'LOADED' : 'loading...',
          merriweather: merriweatherLoaded ? 'LOADED' : 'loading...',
          overall: isLoaded ? 'READY' : 'waiting...'
        });
        
        if (isLoaded || attempts >= maxAttempts) {
          console.log('✅ Fonts ready! Setting fontsLoaded = true');
          setFontsLoaded(true);
          
          // Force canvas re-render på ett mer robust sätt
          setTimeout(() => {
            // Triggra en re-render genom att "nudge" font-states
            const currentSelected = selectedFont;
            
            // Temporärt sätt tomma fonts
            setSelectedFont('');
            
            // Sätt tillbaka efter en kort delay
            setTimeout(() => {
              setSelectedFont(currentSelected);
            }, 50);
          }, 200);
        } else {
          setTimeout(checkFonts, 1000); // Försök igen om 1 sekund
        }
      };
      
      // Börja kolla efter 2 sekunder
      setTimeout(checkFonts, 2000);
    };

    waitForFonts();
  }, []); // Bara en gång

  // Force re-render när fonts ändras - förbättrad version
  useEffect(() => {
    if (fontsLoaded) {
      console.log(`🔄 Font state change:`, { selectedFont, memorialFont, fontsLoaded });
      
      // Vänta lite för att säkerställa att DOM är uppdaterad
      const timeoutId = setTimeout(() => {
        console.log(`🎨 Triggering canvas re-render for font: ${selectedFont}`);
        // Canvas kommer re-rendera automatiskt via useEffect dependencies
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedFont, memorialFont, fontsLoaded]);

  return fontsLoaded;
}
