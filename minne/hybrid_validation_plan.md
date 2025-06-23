## 🛠️ **Teknisk Implementation (denna vecka)**

### **1. Stripe Setup (15 minuter):**
```bash
npm install stripe
```

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXTJS_URL=http://localhost:3000
```

### **2. Cloudflare R2 Setup (10 minuter):**
```bash
npm install @aws-sdk/client-s3
```

```bash
# .env.local (lägg till)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=pet-posters
R2_PUBLIC_URL=https://your-domain.r2.cloudflarestorage.com
```

### **3. API Routes (30 minuter):**
- `/api/create-checkout/route.ts` - Skapar Stripe session + laddar upp bild till R2
- `/api/get-order/route.ts` - Hämtar orderdata för success page
- `/api/webhooks/stripe/route.ts` - Loggar betalningar i Google Sheets (senare)

### **4. Frontend Updates (20 minuter):**
- **TextEditor.tsx:** Lägg till tier-väljare + Stripe checkout-knapp
- **Success page:** Visa orderdetaljer + download för digital tier
- **Pricing display:** Tydlig presentation av 3 tiers

### **5. Kvalitetstest - RESULTAT ✅:**
**Beslut: MEDIUM quality för alla generationer**
- Medium ger 95% av visual value för 20% av kostnaden vs High
- High kostar 4.9x mer ($0.32 vs $0.065) utan proportionell kvalitetsökning
- Medium räcker för print-kvalitet upp till A3-format

```typescript
quality: 'medium' // Optimal kostnad/kvalitet-ratio
```

**Total implementation-tid: ~90 minuter**# Pet Memories - Hybrid Validation Plan
*Skapad: 22 juni 2025*  
*Uppdaterad: 22 juni 2025 (ChatGPT feedback + Stripe implementation)*

## 🎯 Strategi: Validera FÖRST, Optimera SEDAN

### **Core Filosofi:**
```
Kunder → Data → Teknisk Optimering
```
**Inte:** Teknisk Optimering → Kunder

---

## ⚠️ **KRITISKA Gap Analysis (ChatGPT Feedback)**

### **Identifierade Risker & Åtgärder:**

| **Risk** | **Impact** | **Lösning** | **Status** |
|----------|------------|-------------|-----------|
| Manuell email-betalning | Amatörmässigt + flaskhals | ✅ **Stripe Checkout direkt** | **LÖST** |
| Endast A3-print (hög COGS) | Begränsad priskänslighet | ✅ **Multi-tier: 99kr/299kr/499kr** | **IMPLEMENTERAS** |
| Bildlagring för fulfillment | Kan inte upscala/print | ✅ **Cloudflare R2 storage** | **IMPLEMENTERAS** |
| Bara Facebook-ads | Sårbar för CPM-spikar | 🟡 TikTok + Instagram Reels | MEDEL |
| Okänd leveranstid | >48h = customer dissatisfaction | 🟡 SLA-tracking från dag 1 | MEDEL |
| Svag emotional copy | Låg conversion | 🟡 "Fånga din bäste väns själ på akvarell" | MEDEL |

---

## 📋 Fas 1: Minimal MVP Test (Vecka 1)

### **Mål:** Validera betalningsviljan med 20-50 kunder

### **Tech Stack (finaliserad):**
- ✅ **Befintlig AI-kod** (edit-metoden utan seed)
- ✅ **Quality: medium** för alla generationer (bevisat optimal kostnad/kvalitet)
- ✅ **Stripe Checkout direkt** - professionell betalning
- ✅ **Multi-tier pricing** (79kr Digital / 299kr Print 30x45cm)
- ✅ **Cloudflare R2** för bildlagring
- ✅ **Google Sheets logging** (via webhook)
- ✅ **Manual fulfillment** för print/canvas

### **Betalningsflöde (modern e-handel):**
```
1. Kund → AI-generering (medium quality) → Text-editor
2. Kund → Väljer tier → "Beställ"-knapp
3. Frontend → Stripe Checkout (direkt redirect)
4. Stripe → Kund betalar → Success page
5. Webhook → Loggar order i Google Sheets
6. Fulfillment:
   - Digital: Instant download från R2
   - Print/Canvas: Du upscalar → manual Gelato order
```

### **Måtvärden:**
- **Upload → Preview conversion**
- **Preview → Text-editor conversion** 
- **Text-editor → Stripe checkout conversion**
- **Checkout → Payment completion**
- **Total kostnad per order**
- **Kundnöjdhet (email feedback)**
- **Tier-distribution** (Digital vs Print vs Canvas)

---

## 📊 Fas 2: Data-drivet Beslut (Vecka 2)

### **Scenario A: Hög konvertering (>10%)**
**Tecken på success:** Folk betalar faktiskt 299 kr

**Nästa steg:**
- Full Supabase-implementation
- Automatisk Gelato-integration  
- Shopify för smidigare checkout
- A/B-test pricing (199kr vs 399kr vs 499kr)

### **Scenario B: Låg konvertering (2-5%)**
**Tecken på potential:** Intresse men inte tillräckligt värde

**Nästa steg:**
- A/B-test priser (199kr, 149kr)
- Testa andra stilar (mer focus på cartoon/digital)
- Förbättra value prop (framing, packaging)
- Testa andra målgrupper

### **Scenario C: Minimal konvertering (<1%)**
**Tecken på problem:** Fel koncept eller marknad

**Nästa steg:**
- Pivotera till andra nischer (baby-portraits, memorial people)
- Testa B2B (veterinärer, djuraffärer)
- Fundamentalt överväg konceptet

---

## 🛠️ Fas 3: Teknisk Skalning (Månad 2+)

### **När konvertering är bevisad (>5%):**

#### **Database & Tracking:**
```sql
-- Supabase schema
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  memorial_text TEXT,
  input_image_url TEXT NOT NULL,
  final_poster_url TEXT NOT NULL,
  style TEXT NOT NULL,
  prompt_variant TEXT NOT NULL,
  upscaled_url TEXT,
  gelato_order_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Automatisering:**
- **Webhook:** Stripe/PayPal → automatisk upscaling
- **API:** Auto-create Gelato orders
- **Email:** Automatiska tracking-updates

#### **Kvalitetsförbättringar:**
- **GPT-4o mini prompt enhancement** (A/B test enhanced vs original prompts)
- **High quality generation** för premium-tier (499kr)
- **Multiple format support** (A4, A3, canvas)

---

## 💰 Kostnadskalkyl per Order (Uppdaterad med R2)

### **API + Storage Kostnader (Medium Quality):**
```
Preview (2 variants): $0.13 (medium quality - bevisat optimal)
Upscaling (Replicate): $0.01
R2 Storage: $0.01 (per 1GB, ~2000 bilder)
Stripe fees: 1.4% + 2kr
Total tech-kostnad: ~$0.15 + Stripe fees
```

**Kvalitetsbeslut:** Medium ger 95% av visual value för 4.9x lägre kostnad än High quality.

### **Fulfillment per Tier:**

| **Tier** | **Pris** | **Tech Cost** | **Stripe** | **COGS** | **Profit** | **Margin** |
|----------|----------|---------------|------------|----------|------------|-----------|
| **Digital** | 79 kr | 1.4 kr | 2.5 kr | 0 kr | **75.1 kr** | **95%** |
| **30x45cm Print** | 299 kr | 1.4 kr | 6.2 kr | 128 kr | **163.4 kr** | **55%** |

### **Strategiska Fördelar:**
- **Digital = nästan ren profit** med instant delivery
- **Professional checkout** via Stripe → högre conversion
- **Skalbar bildlagring** → kan hantera 1000+ orders
- **Automatisk digital delivery** → noll manuell hantering

---

## 🚀 Implementation Checklist

### **Pre-Launch (denna vecka - FINALISERAD):**
- [ ] **Kvalitetstest:** Medium vs low quality jämförelse
- [ ] **Stripe integration:** API routes + checkout flow
- [ ] **Cloudflare R2:** Bildlagring setup
- [ ] **Multi-tier UI:** Pricing display i TextEditor
- [ ] **Success page:** Order confirmation + digital download
- [ ] **Manual test:** Full E2E med Stripe test cards
- [ ] **Deploy till Vercel production**

### **Implementation Priority:**
```
1. Kvalitetstest (10 min) - avgör om medium/low
2. Stripe + R2 setup (25 min) - env vars + packages
3. API routes (30 min) - checkout + order retrieval
4. Frontend update (20 min) - tier selection + buttons
5. Success page (15 min) - confirmation + download
6. E2E test (10 min) - hela flödet med test card
```

### **Launch (nästa vecka - STRIPE-POWERED):**
- [ ] **Facebook-annons:** "Förvandla ditt husdjurs foto till konstminnning"
- [ ] **Emotional copy A/B test:** 3 variants av landing page
- [ ] **Stripe analytics:** Conversion per tier tracking
- [ ] **Mål:** 100 klick → mät conversion per tier
- [ ] **Manual fulfillment:** Print/Canvas orders via Gelato
- [ ] **Customer feedback:** Email follow-up efter delivery
- [ ] **Optimize:** Baserat på real conversion data

### **Copy Testing Variants:**
```
A: "AI Pet Memorial Posters från 99 kr" (baseline)
B: "Fånga din bäste väns själ på akvarell – en tröst som varar livet ut"
C: "Förvandla ditt husdjurs foto till en tidlös konstminnning från 99 kr"
```

### **Post-Launch (vecka 3-4):**
- [ ] **Analysera conversion-data**
- [ ] **Beslut:** Skala upp eller pivotera
- [ ] **Implementera** Supabase/automatisering (om success)

---

## 🎯 Success Metrics (Uppdaterade)

### **Minima för "Success":**
- **3% total conversion** (upload → payment) - lägre tröskelvärde pga multi-tier
- **90% kundnöjdhet** (email feedback)
- **Break-even efter 15 orders** (digital downloads accelererar break-even)
- **<48h SLA** för physical products

### **Tier-Specifika Metrics:**
- **Digital:** >15% conversion (låg friktion)
- **Print:** 5-8% conversion (beprövad)
- **Canvas:** 1-2% conversion (premium)

### **Indicators för Scale-up:**
- **>10% blended conversion rate**
- **Digital:Print:Canvas ratio** stabiliseras
- **Repeat customers** across tiers
- **Organic social sharing** (customers post results)
- **B2B inquiries** (vet clinics, pet stores)
- **Multi-channel CAC** <150 kr

---

## 📝 Lessons Learned (uppdateras löpande)

### **Tekniska:**
- [ ] Medium vs Low quality results
- [ ] Stripe conversion rates per tier
- [ ] R2 storage performance & costs
- [ ] Digital delivery success rate
- [ ] Upscaling method performance för print/canvas
- [ ] Most successful art styles

### **Business:**
- [ ] **Tier adoption rates** (Digital vs Print vs Canvas)
- [ ] **Stripe checkout abandonment** rates
- [ ] **Copy variant performance** (A vs B vs C)
- [ ] **Average order value** trends
- [ ] Most popular pet types per tier
- [ ] Memorial vs celebration orders
- [ ] **Customer lifetime value** (repeat purchases)

### **Customer:**
- [ ] **Price sensitivity per tier** (upsell/downsell patterns)
- [ ] **Digital satisfaction** vs physical products
- [ ] **Payment friction** (Stripe vs other methods)
- [ ] Most common feedback themes
- [ ] **Referral patterns** (organic sharing)
- [ ] **Emotional copy resonance** (which variant converts)
- [ ] Seasonal variations

---

## 💡 Key Insights (ChatGPT + Stripe-Enhanced)

### **Why Stripe Direct Checkout Works:**
1. **Professional UX** - Standard e-handel flow, ingen friction
2. **Instant gratification** - Digital tier ger omedelbar leverans
3. **Trust signals** - Stripe = trygg betalning för kunder
4. **Conversion optimization** - Färre steg = högre conversion
5. **Automatic receipts** - Stripe hanterar kvitton/emails

### **Critical Success Factors:**
- **Stripe conversion rates** per tier (målvärden: Digital 15%, Print 8%, Canvas 3%)
- **R2 reliability** för bildlagring och digital delivery
- **Manual fulfillment efficiency** för print/canvas orders
- **Emotional copy** som driver från 99kr → 299kr → 499kr upsells

### **When to Pivot:**
- **<2% blended Stripe conversion** after copy optimization
- **Digital tier <8% conversion** (should be frictionless)
- **R2/delivery technical failures** affecting customer experience
- **Negative feedback** on print quality after Gelato fulfillment

### **When to Scale:**
- **>8% blended Stripe conversion** across tiers
- **Stable tier distribution** (predictable revenue mix)
- **Digital delivery working flawlessly** (>98% success rate)
- **Print customers becoming repeat buyers** (lifetime value proven)
- **Manual fulfillment handling** <2 hours per day effort

---

## 🛠️ **Implementation Priority (Finaliserad)**

### **Imorgon (Setup Day):**
1. ✅ **Quality test KLART** - Medium quality fastställt som optimal
2. **Stripe account** - Test keys setup (5 min)
3. **Cloudflare R2** - Bucket + credentials (10 min)
4. **Environment vars** - All keys configured (5 min)

### **Dag 2 (Development Day):**
5. **API routes** - Checkout + order retrieval (45 min)
6. **TextEditor update** - Tier selection + Stripe button (30 min)
7. **Success page** - Order confirmation + download (20 min)
8. **E2E test** - Full flow med Stripe test card (15 min)

### **Dag 3 (Launch Day):**
9. **Deploy production** - Vercel med live Stripe keys (10 min)
10. **Facebook ad** - First campaign med 100kr budget (15 min)
11. **Monitor** - Första betalningen droppar in! 🎉

### **Vecka 2 (Optimization):**
12. **Google Sheets webhook** - Automatic order logging
13. **Copy A/B test** - Emotional variants
14. **Gelato integration** - Streamline print fulfillment

**Total MVP tid: ~2.5 timmar coding + ~30 min setup**

---

*Detta dokument uppdateras baserat på verkliga testresultat, kunddata och teknisk implementation.*

**Nästa steg: 90 minuters implementation → första betalande kunden inom 48 timmar!** 🚀

---

## 📋 **Quick Reference - Tech Stack**

```
Frontend: Next.js 15 + React 19 + Tailwind
AI: OpenAI gpt-image-1 (edit method)
Payments: Stripe Checkout
Storage: Cloudflare R2
Tracking: Google Sheets (webhook)
Fulfillment: Manual → Gelato API (later)
Hosting: Vercel
```

**Setup Commands:**
```bash
npm install stripe @aws-sdk/client-s3
# Add env vars
# Code API routes
# Deploy & test
```

