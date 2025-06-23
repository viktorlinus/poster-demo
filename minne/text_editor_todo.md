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

### Core Features - Grundfunktionalitet
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

### Database & Storage - Datahantering
- [ ] Sätta upp Supabase database
- [ ] Skapa tabeller för generations (id, input_image_url, seed, prompt, output_image_url, created_at)
- [ ] Implementera seed generation (heltal < 2³¹)
- [ ] Spara alla generations i database för senare high-quality rendering
- [ ] Bild-upload till Supabase Storage för input bilder
- [ ] Bild-sparning för output URLs

### File Validation - Filkontroller  
- [ ] Kontrollera filstorlek < 20MB
- [ ] Visa användarvänligt felmeddelande för för stora filer
- [ ] Komprimera bilden client-side om för stor (valfritt)

### A/B Testing System - Prompt Enhancement
- [ ] Integrera OpenAI GPT-4o mini för prompt-analys
- [ ] Skapa vision-analys av input bild
- [ ] Generera förbättrad prompt baserat på bildinnehåll
- [ ] Split-test: Original prompt vs Enhanced prompt
- [ ] Side-by-side jämförelse av resultaten
- [ ] Användare kan välja vilken version de föredrar
- [ ] Spara A/B test resultat för analytics

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

## 🗄️ Database Schema (Supabase)

### `generations` table
```sql
CREATE TABLE generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  input_image_url TEXT NOT NULL,
  seed INTEGER NOT NULL, -- < 2³¹ (2,147,483,647)
  style TEXT NOT NULL,
  original_prompt TEXT NOT NULL,
  enhanced_prompt TEXT, -- från GPT-4o mini analys
  output_image_url TEXT NOT NULL,
  enhanced_output_url TEXT, -- A/B test version
  user_preference TEXT, -- 'original' eller 'enhanced'
  created_at TIMESTAMP DEFAULT NOW(),
  session_id TEXT -- för att gruppera generationer
);
```

### `ab_tests` table  
```sql
CREATE TABLE ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  generation_id UUID REFERENCES generations(id),
  test_type TEXT DEFAULT 'prompt_enhancement',
  variant_a_url TEXT NOT NULL, -- original
  variant_b_url TEXT NOT NULL, -- enhanced  
  user_choice TEXT, -- 'a' eller 'b'
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Tekniska Implementationer

### Seed Generation
```ts
// Generera seed < 2³¹
const generateSeed = (): number => {
  return Math.floor(Math.random() * 2147483647);
};
```

### File Size Validation
```ts
// I frontend innan upload
const validateFile = (file: File): boolean => {
  const maxSize = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSize) {
    alert(`Fil för stor: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max 20MB tillåten.`);
    return false;
  }
  return true;
};
```

### Prompt Enhancement med GPT-4o Mini
```ts
// Ny API endpoint: /api/enhance-prompt
const enhancePrompt = async (imageUrl: string, basePrompt: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user", 
        content: [
          {
            type: "text",
            text: `Analyze this baby photo and enhance this prompt for better artistic results: "${basePrompt}". Focus on the baby's features, lighting, mood, and suggest artistic improvements.`
          },
          {
            type: "image_url",
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    max_tokens: 200
  });
  
  return response.choices[0].message.content;
};
```

### A/B Test Workflow
```ts
// 1. Generera både original och enhanced version
const [originalResult, enhancedResult] = await Promise.all([
  generateImage(originalPrompt, seed),
  generateImage(enhancedPrompt, seed) // samma seed!
]);

// 2. Spara i database
await supabase.from('generations').insert({
  input_image_url,
  seed,
  style,
  original_prompt,
  enhanced_prompt,
  output_image_url: originalResult.url,
  enhanced_output_url: enhancedResult.url,
  session_id
});

// 3. Visa side-by-side för användaren
```

## 🚀 Nästa Session Prioritet (✅ KLART)
1. ✅ Style dropdown (snabb win) - KLART
2. ✅ TextEditor (kärn-feature) - KLART (vanilla Canvas istället för Fabric.js)
3. ✅ Testing och polish - KLART
4. ✅ **Kvalitetsoptimering**: Medium quality fastställt som optimal
   - 95% av visual value för 4.9x lägre kostnad än High ($0.065 vs $0.32 per bild)
   - Perfect för print-kvalitet upp till A3-format
5. 🚀 **NÄSTA FOKUS**: Stripe integration för production-ready MVP