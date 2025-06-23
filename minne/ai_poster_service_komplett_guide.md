# AI‑Poster‑Service – Komplett guide från idé till drift

*(Sammanfattar hela diskussionen: affärsmodell, kostnader, teknikval och steg‑för‑steg‑implementering. Allt priser är exklusive moms och växelkurs EUR 11,5 SEK / USD 10,5 SEK.)*

---

## 1. Vision och kundflöde

1. **Kunden laddar upp ett foto** (vanligen ett spädbarnsporträtt). 2. **Tjänsten genererar tre gratis förhandsutkast** med `quality="low"` (≈ 0,02 USD ≈ 0,22 kr/anrop). 3. **Extra utkast** kan köpas löpande à 10 kr/st (samma billiga kvalitet). Betalning sker **före** nytt API‑anrop. 4. Kunden väljer sitt favoritmotiv och går till **checkout**. 5. Efter betalning körs samma seed + prompt i `quality="high"` (≈ 1,9 kr) → eventuell ESRGAN ×4‑uppskalning. 6. Färdig tryckfil skickas till valfri printmetod (egen skrivare eller POD) och levereras till kund.

> Resultat: total API‑kostnad \~3 kr/order, kontrollerad av kvoter och förhandsbetalning.

---

## 2. Affärs‑ och prissättningsmodell

|                                       | A4        | A3        |                     |
| ------------------------------------- | --------- | --------- | ------------------- |
| **Egen skrivare (XP‑970)**            | ca 55 kr  | ca 71 kr  |                     |
| **Gelato POD + frakt + white‑label**  | ca 139 kr | ca 139 kr |                     |
| **Min. pris för 60 % bruttomarginal** | 140 kr    | 180 kr    | 350 kr (A4 /A3 POD) |

- Skrivare (\~2 690 kr) avskrivs på 2 000 tryck ⇒ 1 kr/poster.
- Kalkyler inkluderar bläck, papper, tub/kuvert, frakt och label.
- ESRGAN‑uppskalning körs lokalt (≈ 0 kr) eller på Replicate (< 0,10 kr).

**Rekommendation**\
• Starta med Gelato (ingen CAPEX, leverans 2–4 arb.dagar).\
• Investera i egen skrivare när volym ≈ 150 A3/månad (break‑even \~200 tryck).

---

## 3. Teknikväg A – *Shopify + Serverless‑app*

### 3.1 Fördelar

- Klar kassa, moms, rabatter, lager
- Kan vara live på < 1 vecka
- En enda liten Vercel‑funktion hanterar all AI‑logik

### 3.2 Arkitektur

```
Shopify Theme  ─┐      Webhooks        Gelato POD
(File upload)   │          ▲             API
                 │          │
AJAX ↔ App Proxy │          │           Stripe/Swish
                 ▼          │                ▲
           Vercel Function──┘                │
                 │  R2/S3 (bilder)           │
                 └─> ESRGAN (Edge GPU) <─────┘
```

### 3.3 Steg‑för‑steg

1. **Produkt‑sida:** File‑upload‑block, "Förhandsgranska"‑knapp.
2. **App Proxy** POST `/apps/ai/preview` → generera tre `low`‑bilder.
3. **“+10 kr för fler skisser”** lägger dold produkt i kundvagnen och gör nytt anrop.
4. \*\*Webhook \*\*\`\` → kör `high` + ESRGAN, skapa Gelato‑order (white‑label).
5. **E‑post**: skicka HD‑thumbnail + spårningslänk.

---

## 4. Teknikväg B – *Headless Next.js‑shop*

- **Front‑end:** Next 13 App Router + Tailwind.
- **API‑routes:** `/api/preview` (low), `/api/finalise` (high + Gelato).
- **Checkout:** Stripe Session eller Swish e‑commerce.
- **DB:** Supabase / PlanetScale lagrar order‑token, seed, fil‑URL.
- **Objektlagring:** Cloudflare R2 (fotouppladdning + renderRESULTS).
- **Fördelar:** Full UX‑kontroll, inga plattformsavgifter.
- **Nackdelar:** 2–3× längre utvecklingstid.

---

## 5. Kärn‑kodexempel (TypeScript, Vercel)

### 5.1 API Route (NextJS 15 App Router)
```ts
// src/app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { toFile } from 'openai/uploads';

export async function POST(request: NextRequest) {
  try {
    // Använd inbyggd FormData API (ingen formidable behövs)
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validera filtyp
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      return NextResponse.json({
        error: `Filtyp inte stödd: ${file.type}. Använd JPEG, PNG eller WebP.`
      }, { status: 400 });
    }

    // Konvertera File till Buffer för OpenAI
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Få rätt filextension baserat på MIME-typ
    const getExtension = (mimeType: string) => {
      switch (mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
          return 'jpg';
        case 'image/png':
          return 'png';
        case 'image/webp':
          return 'webp';
        default:
          return 'jpg';
      }
    };
    
    // Skapa korrekt filnamn med rätt extension
    const extension = getExtension(file.type);
    const fileName = `image.${extension}`;
    
    // Använd toFile med korrekt filnamn och MIME-typ
    const imageFile = await toFile(buffer, fileName, { type: file.type });
    
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY! 
    });

    // GPT Image 1 - images.edit returnerar base64 format
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: imageFile,
      prompt: 'Transform this baby photo into a delicate watercolor birth poster with soft pastel washes, white margins, and an artistic tender style suitable for a nursery. Make it look like a beautiful commemorative artwork.',
      size: '1024x1536',
      quality: 'low',
      n: 1
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from API');
    }
    
    // Hantera både URL och base64 format
    let imageUrl;
    if (response.data[0].url) {
      imageUrl = response.data[0].url;
    } else if (response.data[0].b64_json) {
      // Konvertera base64 till data URL
      imageUrl = `data:image/png;base64,${response.data[0].b64_json}`;
    } else {
      throw new Error('No image URL or base64 data returned');
    }
    
    return NextResponse.json({ url: imageUrl });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
```

### 5.2 Frontend Component
```tsx
// src/app/page.tsx
'use client';
import { useState } from 'react';

export default function Home() {
  const [preview, setPreview] = useState<string>();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!file) {
      return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/preview', { 
        method: 'POST', 
        body: formData 
      });
      
      const data = await res.json();
      
      if (data.error) {
        alert(`Fel: ${data.error}`);
        return;
      }
      
      if (data.url) {
        setPreview(data.url);
      } else {
        alert('Ingen bild-URL mottagen');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Något gick fel, försök igen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">AI-Poster MVP</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Ladda upp spädbarnsporträtt
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setFile(e.target.files?.[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <button 
          onClick={handleClick}
          disabled={!file || loading}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 font-semibold"
        >
          {loading ? 'Genererar akvarell-poster...' : 'Förhandsgranska (gratis)'}
        </button>
      </div>

      {preview && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Din AI-genererade poster:</h2>
          <img 
            src={preview} 
            alt="AI Generated Poster"
            className="w-full border-2 border-gray-300 rounded-lg shadow-md"
          />
          <p className="text-sm text-gray-600 mt-2">
            Detta är en låg-kvalitets förhandsvisning. Final poster blir högupplöst.
          </p>
        </div>
      )}
    </main>
  );
}
```

### 5.3 Package.json dependencies
```json
{
  "dependencies": {
    "next": "15.3.4",
    "openai": "^5.5.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### 5.4 Environment Variables
```bash
# .env.local
OPENAI_API_KEY=sk-proj-...
```

**Viktiga tekniska notes:**
- NextJS 15 App Router har inbyggt FormData-stöd - **ingen formidable behövs**
- `images.edit` returnerar alltid base64 format (b64_json)
- Konvertera till data URL: `data:image/png;base64,${base64data}`
- Använd vanlig `<img>` tag, inte NextJS `<Image>` för data URLs

---

## 6. Roadmap (6‑veckors POC)

| Vecka | Leverabel                                               |
| ----- | ------------------------------------------------------- |
| 1     | Shopify‑konto, theme‑branding, fil‑upload block         |
| 2     | Vercel‑funktion v0 (3 skisser) + R2‑bucket              |
| 3     | Extra‑skiss‑knapp (dold produkt), orders‑table          |
| 4     | Webhook `orders/paid` → `high` + ESRGAN, Gelato sandbox |
| 5     | White‑label pack‑ins, e‑postflöden, GDPR‑policy         |
| 6     | 10 live‑orders, justera UI‑copy & pris                  |

---

## 7. Beslutsmatris – när byta plattform?

- **Plattformsavgifter > 5 000 kr/mån** → gå headless.
- **Behov av inline Apple Pay / Swish** → headless.
- **Volym > 150 A3/mån** → överväg egen skrivare (sparar 40 kr/affisch).

---

## 8. Nästa steg

1. Beställ Gelato‑sample (A3 premium‑matte).
2. Sätt upp gratis dev‑store på Shopify.
3. Deploy före‑skriven Vercel‑funktion (se kod ovan).
4. Testa komplett flöde internt med Swish‑sandbox.
5. Mät KPI: genereringar/order, kostnad/order, konverteringsgrad.

> **Klart!** Med det här dokumentet kan du både budgetera och starta utvecklingen utan att missa några större steg eller kostnadsfällor.

---

## 9. Kodexempel

### 9.1 React‑upload‑komponent (Shopify‑theme)  
*(placera bundlad js‑fil i `assets/ai‑uploader.js` och inkludera `<script src="{{ 'ai-uploader.js' | asset_url }}" defer></script>` i product‑template)*
```jsx
// ai-uploader.js (Vite/ESBuild bundlad)
{...snipped for brevity...}
```

### 9.2 Next.js (13+) boilerplate – pratar samma Vercel‑funktion  
*(endast de viktigaste filerna visas)*
```text
my-shop/
├─ app/
│  ├─ page.tsx
│  ├─ api/preview/route.ts
│  └─ checkout/page.tsx
└─ ...
```
```tsx
// api/preview/route.ts
{...}
```

### 9.3 Canvas/Fabric.js‑overlay – interaktiv text i Shopify
*(lägg bundlad kod i `assets/ai-canvas.js` + `<script ...>` i samma mall)*
```jsx
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { fabric } from 'fabric';

function AiCanvas({ baseUrl, onSave }) {
  const canvasRef = useRef(null);
  const [name, setName] = useState('Alma');
  const [info, setInfo] = useState('2025-06-20 • 03:42');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1024,
      height: 1536,
      backgroundColor: '#fff',
    });
    fabric.Image.fromURL(baseUrl, img => {
      img.set({ selectable: false, left: 0, top: 0, scaleX: 1, scaleY: 1 });
      canvas.add(img);
      addText();
    });

    function addText() {
      canvas.getObjects('text').forEach(t => canvas.remove(t));
      const title = new fabric.Text(name, {
        fontFamily: 'GreatVibes', fontSize: 120, fill: '#222', top: 1250, selectable: true, originX: 'center', left: 512,
      });
      const subtitle = new fabric.Text(info, {
        fontFamily: 'Helvetica', fontSize: 48, fill: '#444', top: 1360, selectable: true, originX: 'center', left: 512,
      });
      canvas.add(title, subtitle);
      canvas.renderAll();
    }
    return () => canvas.dispose();
  }, [baseUrl, name, info]);

  const handleSave = () => {
    const dataUrl = canvasRef.current.toDataURL({ format: 'png', multiplier: 4 }); // 4× för hög DPI
    onSave(dataUrl);
  };

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="border" />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Namn" />
      <input value={info} onChange={e => setInfo(e.target.value)} placeholder="Födelsedata" />
      <button className="btn" onClick={handleSave}>Spara & fortsätt</button>
    </div>
  );
}

// Mount example (assumes you have previewUrl available)
const node = document.getElementById('ai-canvas-root');
if (node) createRoot(node).render(<AiCanvas baseUrl={node.dataset.img} onSave={url => {
  fetch('/apps/ai/finalise', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({img:url, orderToken: window.orderToken})});
}} />);
```
*Serverless‑endpoint `/apps/ai/finalise` tar emot PNG‑data‑URL, konverterar till TIFF och laddar upp till Gelato eller lokal printkö.*

---

### 9.2 Next.js (13+) boilerplate – pratar samma Vercel‑funktion

```
my-shop/
├─ app/
│  ├─ page.tsx            ← landing + upload form
│  ├─ api/
│  │   └─ preview/route.ts  ← proxy till Vercel‑funktion
│  └─ checkout/page.tsx   ← Stripe/Swish checkout
├─ lib/openai.ts
├─ lib/storage.ts         ← R2 upload util
├─ package.json
└─ tsconfig.json
```

**api/preview/route.ts**

```ts
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fileUrl, orderToken } = body;
  const res = await fetch(process.env.VERCEL_AI_URL + '/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileUrl, orderToken })
  });
  return NextResponse.json(await res.json());
}
```

**app/page.tsx** (upload + preview)

```tsx
'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File>();
  const [prev, setPrev] = useState<string[]>([]);

  async function handlePreview() {
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: (() => { const f=new FormData(); f.append('file', file!); return f; })() }).then(r=>r.json());
    const res = await fetch('/api/preview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ fileUrl: uploadRes.url, orderToken: crypto.randomUUID() })}).then(r=>r.json());
    setPrev(res);
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <input type="file" onChange={e=>setFile(e.target.files?.[0])} />
      <button className="btn mt-4" onClick={handlePreview} disabled={!file}>Förhandsgranska</button>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {prev.map(u=><img key={u} src={u} className="border" />)}
      </div>
    </main>
  );
}
```

*Checkout*, HD-rendering‑webhook och Gelato‑integration återanvänder samma Vercel‑endpoint‑URL\:er – du behöver bara uppdatera environment‑variabler i `.env.local`.

---

> 💡 **Tipset:** Bygg Vercel‑funktionen som ett litet REST‑API ( `/preview`, `/extra`, `/finalise` ) och använd den **oförändrad** oavsett frontend. Då blir bytet Shopify → Next.js ett rent UI‑projekt.

---

## 10. Betal­flöde (Stripe & Swish)

### 10.1 Shopify‑MVP ("dold produkt"‑metoden)

- **Extra skiss‑produkt** (10 kr, `status:draft`, `id=999`).
- React‑knappen gör:
  1. `await fetch('/cart/add.js', {method:'POST', body: JSON.stringify({id:999,quantity:1})})`
  2. anropar `/apps/ai/preview?extra=true` (proxy läser cart, ser att extra‑produkt redan ligger där ⇒ anropar OpenAI).
- Kunden betalar både tavla **och** extra skisser i samma Shopify‑checkout (Stripe, Kort, Swish via t.ex. QuickPay‑appen).

### 10.2 Next.js‑flow

- **Extra skiss** → `POST /api/payment/intent` (serverless):
  ```ts
  const stripe = new Stripe(STRIPE_KEY);
  const intent = await stripe.paymentIntents.create({
    amount: 1000, currency:'sek', payment_method_types:['card','swish'],
    capture_method:'automatic'
  });
  return {clientSecret:intent.client_secret};
  ```
- Front‑end bekräftar betalning → när `status=succeeded` (Stripe) eller `status=PAID` (Swish) kallar `/api/preview?extra=true`.

## 11. ESRGAN‑uppskalning

| Alternativ                                                                                        | Fördelar                                              | Kodsnutt                                                                                                              |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Lokal GPU‑container** (Render GPU dyno, Lambda GPU, etc.)                                       | Billigast vid volym; full kontroll; \~1–2 s per 1k‑px | `docker run --gpus all -v /mnt:/mnt esrgan/realesrgan realesrgan -i /mnt/in.png -o /mnt/out.png -n realesrgan-x4plus` |
| **Replicate API**                                                                                 | Ingen drift; 0.002–0.01 \$ per bild                   | \`\`\`js                                                                                                              |
| fetch('[https://api.replicate.com/v1/predictions',{](https://api.replicate.com/v1/predictions',{) |                                                       |                                                                                                                       |
| method:'POST',                                                                                    |                                                       |                                                                                                                       |
| headers:{'Authorization':'Token '+REPL\_KEY,'Content-Type':'application/json'},                   |                                                       |                                                                                                                       |
| body\:JSON.stringify({version:'real-esrgan',input:{image\:url,scale:4}})                          |                                                       |                                                                                                                       |
| });\`\`\`                                                                                         |                                                       |                                                                                                                       |
| **HuggingFace Endpoint**                                                                          | Lik Replicate men fast månadspris                     | –                                                                                                                     |

> Vercel Edge Functions saknar GPU – välj Render, EC2 g4dn, eller Replicate.

## 12. Robust fel­hantering & loggning

- **OpenAI‑fel:** retrier med exponentiell backoff (1 s → 2 s → 4 s). Efter tre misslyckade försök: skicka JSON `{error:'temporarily_unavailable'}` till front‑end och visa “Tyvärr, försök igen om en stund”.
- **Gelato‑API 5xx:** lagra HD‑filens URL i DB (`status='pending_gelato'`). Kör cron‑job var 10 min och gör nytt `POST /orders` tills 200 OK eller max‑reties.
- **Betalning lyckas men AI misslyckas:** Shopify‑order markeras `cancelled` via Admin‑API; Stripe/Swish refund via `paymentIntents.cancel` eller Swish `refund` endpoint.
- **Logging:**
  - **Cloudflare Workers KV** – snabb kvittning av `generation_id`, seed, API‑cost.
  - **Sentry** – stacktraces + breadcrumbs (frontend & backend).
  - **Grafana Cloud** – API‑spend / dag, fail‑ratio, P95‑latency dashboards.

> **Checklist**: implementera circuit‑breaker som stoppar samtliga nya AI‑anrop om felkvot > 10 % under fem minuter – undvik spiraler av misslyckade betalningar.

---
---

## 13. Shopify‑koppling – snabb­väg från MVP till live‑butik

> **Målet:** behåll hela din Next.js‑backend (upload + AI‑preview) och låt Shopify‑temat anropa den via App Proxy. Ingen backend‑kod ändras.

### 13.1 Skapa App Proxy
| Fält | Värde |
|------|-------|
| **Sub‑path prefix** | `apps` |
| **Sub‑path** | `ai` |
| **Proxy URL** | `https://<ditt‑vercel‑projekt>.vercel.app/api` |

Efter ”Save” kan front‑end anropa
```
/store.myshop.com/apps/ai/preview  →  proxas till  →  …vercel.app/api/preview
``` 

### 13.2 Flytta front‑end‑koden till temat
1. Bundla din React/JS‑kod (vite → `ai-uploader.js`).  
2. Ladda upp filen i **Theme › assets**.  
3. Sätt in i product‑mallen:
```liquid
<div id="ai-root">
  <input type="file" id="fileInput" name="file" accept="image/*" />
  <select id="style">
    <option value="watercolor">Akvarell</option>
    <option value="pencil sketch">Blyerts</option>
  </select>
  <button id="genBtn">Förhandsgranska</button>
  <img id="aiPreview" style="display:none;margin-top:20px" />
</div>
{{ 'ai-uploader.js' | asset_url | script_tag }}
```
4. I JS‑filen: byt `fetch('/api/preview' …)` → `fetch('/apps/ai/preview' …)`.

### 13.3 Line‑item‐properties (spara kundens val)
```js
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: PRODUCT_VARIANT_ID,
    quantity: 1,
    properties: {
      Style: document.getElementById('style').value
    }
  })
});
```
Webhook `orders/paid` kan nu läsa `line_items[*].properties.Style` och använda exakt samma prompt och seed vid `quality="high"`‑rendern.

### 13.4 När du *måste* gå headless
| Trigger | Indikation |
|---------|------------|
| Egen inline‑kassa (Swish/Stripe) | Behöver Headless (Hydrogen/Next) |
| Tyngre editor > 100 kB JS | Theme börjar kännas segt |
| Shopify‑avgifter > ≈5 000 kr/mån | Egen stack lönar sig |

Flytten är enkel: behåll Vercel‑API‑et orört, byt bara front‑end.

---

