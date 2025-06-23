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
        
        // Testa om Great Vibes är tillgänglig genom att mäta text-bredd
        const testElement = document.createElement('span');
        testElement.style.fontFamily = '"Great Vibes", cursive';
        testElement.style.fontSize = '72px';
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        testElement.style.whiteSpace = 'nowrap';
        testElement.textContent = 'Testing Font';
        document.body.appendChild(testElement);
        
        const greatVibesWidth = testElement.offsetWidth;
        
        // Testa med fallback font
        testElement.style.fontFamily = 'cursive';
        const fallbackWidth = testElement.offsetWidth;
        
        document.body.removeChild(testElement);
        
        // Om bredden är olika, så är Great Vibes laddad
        const isLoaded = Math.abs(greatVibesWidth - fallbackWidth) > 5;
        
        console.log(`Font check attempt ${attempts}: Great Vibes ${isLoaded ? 'LOADED' : 'loading...'} (${greatVibesWidth}px vs ${fallbackWidth}px)`);
        
        if (isLoaded || attempts >= maxAttempts) {
          console.log('✅ Fonts ready! Setting fontsLoaded = true');
          setFontsLoaded(true);
          
          // Force en canvas update
          setTimeout(() => {
            setSelectedFont(selectedFont);
          }, 100);
        } else {
          setTimeout(checkFonts, 1000); // Försök igen om 1 sekund
        }
      };
      
      // Börja kolla efter 2 sekunder
      setTimeout(checkFonts, 2000);
    };

    waitForFonts();
  }, []); // Bara en gång

  // Force re-render när fonts ändras
  useEffect(() => {
    if (fontsLoaded) {
      console.log(`🔄 Font changed: ${selectedFont} / ${memorialFont}`);
      setTimeout(() => {
        setSelectedFont(selectedFont);
      }, 50);
    }
  }, [selectedFont, memorialFont, fontsLoaded, setSelectedFont]);

  return fontsLoaded;
}
