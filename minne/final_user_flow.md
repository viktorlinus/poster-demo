# Final User Flow & Process - AI Poster MVP
*Datum: 23 juni 2025*

## 🔄 Komplett User Journey

### **Steg 1: AI Generation**
```
Upload husdjursfoto → AI genererar 2 optimerade varianter → Kund väljer favorit
```

### **Steg 2: Text Editor (OPTIONAL)**
```
ANTINGEN:
A) "Använd som den är" → Direkt till checkout
B) "Lägg till text" → Text editor → Lägg till namn/memorial text → Checkout
```

### **Steg 3: Tier Selection & Payment**
```
Välj tier:
- Digital (79kr): Högupplöst fil för hemutskrift + instant download
- Print (299kr): 30x45cm Premium Matt + inkluderar digital fil

→ Stripe Checkout → Betala
```

## ⚙️ Teknisk Backend Process

### **Pre-Payment (Temporary Storage)**
```
Klick "Beställ" → 
- Spara final poster (medium quality) i R2 som TEMPORARY
- Key: temp_order_12345.png
- Stripe Checkout session skapas med temp_order_id
```

### **Post-Payment (Webhook Trigger)**
```
Stripe webhook "payment_succeeded" → 
1. Flytta temp_order_12345.png → paid_order_12345.png
2. Digital tier: Email till kund med download-länk (medium quality)
3. Print tier: Email till Viktor + upscale process startar
```

## 🖨️ Print Order Manual Process

### **Viktor's Workflow (5 min per order):**
```
1. Få email: "Ny print-order #12345"
2. Hämta paid medium-quality bild från R2
3. UPSCALE bilden (Real-ESRGAN/Replicate 4x)
4. Upload upscalad bild till Gelato med kundadress
5. Gelato skickar automatiskt tracking till kund
```

### **Viktigt - INGEN ny AI-generation:**
- ✅ **Endast upscale** av befintlig medium-quality bild
- ✅ **Samma prompt/stil** som kunden valde
- ✅ **Kvalitetskontroll** innan Gelato-upload
- ✅ **Snabbt & kontrollerbart**

## 💰 Pricing & Margins

### **Digital Tier (79kr):**
- Tech kostnad: 1.4kr (AI + storage)
- Stripe fee: 2.5kr
- **Profit: 75.1kr (95% marginal)**

### **Print Tier (299kr):**
- Tech kostnad: 1.4kr (AI + storage)
- Upscale kostnad: ~1kr (Replicate/Real-ESRGAN)
- Gelato kostnad: 128kr (produkt + frakt)
- Stripe fee: 6.2kr
- **Profit: 162.4kr (54% marginal)**

## 🗂️ R2 Storage Structure

### **Bucket Organization:**
```
/temp_orders/          → Obestalda bilder (auto-radera efter 24h)
  temp_order_12345.png
  
/paid_orders/          → Betalda bilder (permanent)
  paid_order_12345.png
  
/upscaled/            → Print-ready bilder (4x upscaled)
  upscaled_order_12345.png
```

## 📧 Email Notifications

### **Digital Purchase:**
```
Till kund:
- Orderbekräftelse
- Download-länk till high-res fil
- Utskriftsinstruktioner (A4/A3 hemma)
```

### **Print Purchase:**
```
Till kund:
- Orderbekräftelse  
- Info om 2-4 dagars leveranstid
- Inkluderar digital download-länk

Till Viktor:
- "Ny print-order #12345"
- Kundadress för Gelato
- Länk till medium-quality bild för upscaling
```

## 🎯 Key Features

### **Text Editor:**
- ✅ **Helt frivilligt** - många vill bara ha AI-bilden som den är
- ✅ **Vanilla Canvas** implementation (inga externa dependencies)
- ✅ **Google Fonts** integration för professionell typografi
- ✅ **Real-time preview** av ändringar

### **Payment Flow:**
- ✅ **Professional Stripe Checkout** - höjer conversion
- ✅ **Instant digital delivery** - 95% margin produkt
- ✅ **Print inkluderar digital** - bättre value proposition
- ✅ **Manual print quality control** - säkrar kundnöjdhet

### **AI Generation:**
- ✅ **Medium quality** för optimal kostnad/kvalitet (95% av värdet för 20% av kostnaden)
- ✅ **2 optimerade prompts** per stil för bästa resultat
- ✅ **6 konststilar** med stil-specifik prompt-optimering
- ✅ **1024x1536 format** som passar perfekt för 30x45cm print

## 🚀 Implementation Priority

### **Nästa steg (denna vecka):**
1. **Stripe setup** - API keys och webhook endpoint
2. **Cloudflare R2** - bucket och access keys  
3. **TextEditor update** - optional flow + pricing tiers
4. **API routes** - `/create-checkout`, `/webhooks/stripe`
5. **Success page** - order confirmation + download
6. **Test order** - kvalitetskontroll via Gelato

### **Success Metrics:**
- **Upload → Payment conversion**: Target 5-8%
- **Digital vs Print ratio**: Förväntat 70/30
- **Customer satisfaction**: >90% (email feedback)
- **Manual process efficiency**: <5 min per print order

---

*Status: Final specification klar för implementation*  
*Datum: 23 juni 2025*  
*Nästa: Stripe + R2 setup & coding*
