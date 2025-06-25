# MVP Todo & Issues - PetMemories
*Uppdaterad: 25 juni 2025*

## 🚨 KRITISKA ISSUES ATT FIXA

### **1. Metadata-problem i checkout:**
- **Problem**: Om användare väljer "bara bild" (ingen text) sparas namnet som "bella" fast vi inte vet namnet
- **Orsak**: Text editor sätter ett default-namn även när inget namn anges
- **Fix needed**: 
  - Kontrollera om användare faktiskt lagt till text
  - Om ingen text: sätt petName som "Pet" eller "Husdjur" eller ta bort helt
  - Uppdatera både checkout-metadata och download-filnamn

### **2. Andra kända issues:**
- [ ] **Manual fulfillment rutin** saknas för print orders
- [ ] **Impressum/företagsinfo** saknas i footer
- [ ] **Support-email** behöver skapas

## ✅ MVP-CHECKLISTAN – "Pet Memories"
*(allt du verkligen måste bocka av innan du trycker på **Starta annonser**)*

### **1. Produkt & teknik**
| Status | Punkt | Det du ska dubbelkolla |
|--------|-------|------------------------|
| ✅ | **AI-generering** fungerar från upload → preview | - Felhantering (timeout, 429-limit)<br>- Watermark på gratis-preview |
| ✅ | **Rate-limit** 3 requests / IP / dygn (+5 efter köp) | - Insert/Update i `daily_usage`-tabell<br>- 429-svar returnerar begripligt felmeddelande |
| ✅ | **Stripe Checkout** live-nycklar | - Testat med riktigt kort 1 kr<br>- Success-sida visar rätt tier & download-länk |
| ✅ | **R2-upload** & URL i Stripe metadata | - Bilden öppnas i 100 % skala<br>- URL fungerar i Success-sidan |
| ✅ | **Digital delivery** via download-länk | - Säker URL med sessionId-validering<br>- **ISSUE: Filnamn problem när ingen text** |
| ⚠️ | **Manual fulfilment-rutin** | - Checklista: upscale → beställ Gelato → markera "shipped" |

### **2. Legal & betalkrav**
| Status | Punkt |
|--------|-------|
| ✅ | **Integritetspolicy & personuppgiftstext** (GDPR) på /privacy |
| ✅ | **Köpvillkor** med "ej ångerrätt för personliga varor" |
| ❌ | **Impressum/företagsinfo** (namn, adress, e-post) i footer |
| ⚠️ | **Stripe-kvitto** visar korrekt "Pet Memories (sole proprietor)" |

### **3. UX & konvertering**
| Status | Punkt |
|--------|-------|
| ✅ | **Landningssida** < 3 sek LCP (Lighthouse) |
| ✅ | **Hero-hook** klar: *"Fånga din hund som akvarell på 60 sekunder – prova gratis."* |
| ✅ | **CTA-flöde**: Upload → Preview → Tier-val → Betala |
| ✅ | **Quota-räknare** i UI ("2 av 3 tester kvar i dag") |
| ✅ | **Success / Download-sida** med:<br>• Ladda-ner-knapp (digital)<br>• Leveransinfo (print/canvas)<br>• Delnings-CTA |

### **4. Data & spårning**
| Status | Punkt |
|--------|-------|
| ✅ | **GA4** grundevents: `view_item`, `begin_checkout`, `purchase` |
| ❌ | **Meta-pixel** (kommer behövas vid annonser) |
| ⚠️ | **"first_test" event** – fyras när någon gör sin första AI-generering |
| ❌ | **Google Sheet** eller DB-vy för daglig KPI-logg:<br>• traffic • genereringar • orders • AOV • AI-kostnad |

### **5. Support & drift**
| Status | Punkt |
|--------|-------|
| ❌ | **support@…**-adress (Gmail-alias eller Workspace) |
| ❌ | **Auto-reply**: "Vi svarar inom 24 h – kolliderar din leverans? Ring 07X-…" |
| ⚠️ | **FAQ-sektion** (3 frågor räcker: leveranstid, returer, bildkrav) |
| ⚠️ | **Fail-safe**: om AI-API nere → visa "Underhåll – kom tillbaka senare" i stället för 500-fel |

### **6. Marknad & lansering**
| Status | Punkt |
|--------|-------|
| ❌ | **Brand-IG + FB-sida** med logo, bio, första inlägg |
| ❌ | **Reel #1** inspelad (15 sek "before/after"-demo) |
| ❌ | **Rabattkod "BETA50"** skapad i Stripe |
| ❌ | **Annonstext** utkast klar (Feed + Reels) |
| ❌ | **Trusted "inner circle"-lista** (10 hundägare) för smoke-test + feedback-enkät |

### **7. Ekonomi & mål**
| Status | Punkt |
|--------|-------|
| ⚠️ | **AI-kostnadskalkyl**: `max_daily_calls * 0,008 $` ≤ budget |
| ⚠️ | **Break-even-sheet**: AOV, COGS, Stripe-avgift, AI-avgift, ads-budget |
| ❌ | **2-veckors mål** fastlagda:<br>• 1000 sessions • ≥ 12 betalande • CAC ≤ 150 kr • NPS ≥ 60 |

## 🔧 NÄSTA STEG PRIORITERING

### **Denna vecka (Kritiskt):**
1. **🚨 FIX: Metadata-problem** - Filnamn utan text-input
2. **📧 Support-email** setup (Gmail alias)
3. **📋 Manual fulfillment** checklista för print orders
4. **🏢 Impressum** i footer

### **Nästa vecka (Marketing prep):**
1. **📊 Meta Pixel** installation
2. **📈 KPI tracking sheet** setup
3. **📱 Social media** accounts (IG/FB)
4. **🎬 Första reel** produktion

### **👉 När alla rutor är ikryssade:**
1. **Smoke-testa** (vänkreach) → validera tider
2. **Iterera copy** om `begin_checkout / sessions` < 20 %
3. Sätt **200–300 kr/dag** på första Meta-kampanjen och följ KPI-arket dagligen

---

**Status: 75% av MVP-checklist klar. Fokus nu på kritiska fixes innan marketing.**