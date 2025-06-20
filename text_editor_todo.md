# Text Editor & Style Selection - Implementation TODO

## 📋 Sammanfattning
Lägg till text-overlay funktionalitet och stil-väljare till AI-poster MVP:n.

## 🎨 Feature 1: Style Selection Dropdown

### Steg 1: Uppdatera Frontend (page.tsx)
```tsx
// Lägg till i upload-formen
<select 
  name="style" 
  value={style}
  onChange={e => setStyle(e.target.value)}
  className="border p-2 rounded"
>
  <option value="watercolor">Akvarell</option>
  <option value="pencil sketch">Blyerts</option>
  <option value="oil painting">Oljemålat</option>
  <option value="charcoal drawing">Kolritning</option>
  <option value="pastel drawing">Pastellritning</option>
</select>
```

### Steg 2: Skicka style med FormData
```js
const formData = new FormData();
formData.append('file', file);
formData.append('style', style);  // Ny rad

await fetch('/api/preview', { 
  method: 'POST', 
  body: formData 
});
```

### Steg 3: Läs style i API route
```ts
// I /api/preview/route.ts
const formData = await request.formData();
const file = formData.get('file') as File | null;
const style = formData.get('style') as string || 'watercolor';

// Uppdatera prompt
const prompt = `Transform this baby photo into a delicate ${style} birth poster with soft pastel washes, white margins, and an artistic tender style suitable for a nursery. Leave empty space at bottom for custom text overlay. Do not include any text in the generated image.`;
```

## ✍️ Feature 2: Text Editor med Canvas + Fabric.js

### Steg 1: Installera dependencies
```bash
npm install fabric
npm install --save-dev @types/fabric
```

### Steg 2: Skapa TextEditor komponenten
```tsx
// components/TextEditor.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface TextEditorProps {
  backgroundImageUrl: string;
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export default function TextEditor({ backgroundImageUrl, onSave, onCancel }: TextEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [name, setName] = useState('Lucas');
  const [birthInfo, setBirthInfo] = useState('24 April, 298 • 🍼 Nöten • 281 in');
  const [selectedFont, setSelectedFont] = useState('Great Vibes');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Fonter som passar temat
  const fonts = [
    'Great Vibes',      // Script/handwriting
    'Playfair Display', // Elegant serif  
    'Montserrat',       // Modern sans
    'Dancing Script',   // Casual script
    'Cormorant Garamond' // Classic serif
  ];

  // TODO: Implementera canvas setup, text rendering, export funktionalitet
}
```

### Steg 3: Google Fonts integration
```tsx
// Lägg till i layout.tsx eller komponenten
useEffect(() => {
  // Ladda Google Fonts dynamiskt
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
}, []);
```

### Steg 4: Canvas funktionalitet
- Canvas setup med bakgrundsbild
- Text-objekt med font/stil kontroller
- Positionering (bottom area)
- Export till high-res PNG
- Responsive design

### Steg 5: Integrera i main page.tsx
```tsx
// Lägg till states
const [showTextEditor, setShowTextEditor] = useState(false);
const [finalImage, setFinalImage] = useState<string>();

// Lägg till efter preview
{preview && !showTextEditor && (
  <button 
    onClick={() => setShowTextEditor(true)}
    className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
  >
    Lägg till text
  </button>
)}

{showTextEditor && (
  <TextEditor
    backgroundImageUrl={preview}
    onSave={(dataUrl) => {
      setFinalImage(dataUrl);
      setShowTextEditor(false);
    }}
    onCancel={() => setShowTextEditor(false)}
  />
)}
```

## 🛍️ Shopify Kompatibilitet

### Enkelt att portera eftersom:
- ✅ Samma JavaScript-kod fungerar i Shopify theme
- ✅ Fabric.js kan bundlas med Vite/Webpack -> `assets/text-editor.js`
- ✅ Canvas.toDataURL() fungerar likadant
- ✅ FormData API:t är samma

### Shopify-specifika steg:
1. Bundla TextEditor -> `ai-text-editor.js`
2. Lägg i `assets/` mappen
3. Inkludera i product template
4. Använda samma Vercel API endpoints

## 📋 Implementation Checklist

### Grundfunktionalitet
- [ ] Lägg till style dropdown
- [ ] Skicka style med FormData  
- [ ] Uppdatera API prompt med style + "no text" instruktion
- [ ] Installera Fabric.js
- [ ] Skapa TextEditor komponent
- [ ] Ladda Google Fonts
- [ ] Canvas setup med bakgrundsbild
- [ ] Textfält för namn och födelseinformation
- [ ] Font-väljare dropdown
- [ ] Bold/Italic checkboxes
- [ ] Text positionering (bottom area)
- [ ] Export till PNG funktion
- [ ] Integrera i main page flow

### Styling & UX  
- [ ] Responsive canvas design
- [ ] Snygga form kontroller
- [ ] Loading states
- [ ] Preview av text changes i real-time
- [ ] Bra typografi och spacing

### Testing
- [ ] Testa alla fonter fungerar
- [ ] Testa bold/italic kombinationer  
- [ ] Testa olika bildstorlekar
- [ ] Testa på mobil/desktop
- [ ] Verifiera export-kvalitet

### Shopify Prep (för framtiden)
- [ ] Dokumentera bundle-process
- [ ] Testa kod fungerar utan ES6 modules
- [ ] Planera asset-hantering

## 🎯 Tekniska Beslut

**Canvas Library:** Fabric.js (robust, vältestad, bra docs)
**Fonts:** Google Fonts (tillgängligt, snabbt, många vackra alternativ)  
**Export Format:** PNG (bättre kvalitet än JPEG för text)
**Text Positioning:** Fixed bottom area (enklare än fritt placerbar)
**Responsiveness:** Scale canvas baserat på viewport

## ⏱️ Tidsuppskattning
- Style dropdown: 30 min
- Fabric.js setup: 2-3 timmar  
- TextEditor komponent: 4-6 timmar
- Integration och polish: 2-3 timmar
- **Total: ~1-2 arbetsdagar**

## 🚀 Nästa Session Prioritet
1. Style dropdown (snabb win)
2. Fabric.js TextEditor (kärn-feature)
3. Testing och polish