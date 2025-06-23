# Pricing & Product Update - 23 juni 2025

## 🎯 Uppdaterad Pricing Strategy

### **Nya Priser (optimerade):**
- **Digital Download: 79 kr** (från 99 kr)
- **30x45cm Premium Matt Print: 299 kr** (från A3)

### **Varför ändring:**

#### **Digital: 99kr → 79kr**
- ✅ **Lägre tröskel** för test-kunder
- ✅ **Bättre psykologisk prissättning** (under 80kr)
- ✅ **Fortfarande 95% marginal** (kostar ~2kr)
- ✅ **Naturlig upsell** till print (79 → 299kr = 4x)

#### **Print: A3 → 30x45cm**
- ✅ **Perfekt format** för 1024x1536 AI-bilder (0.67 ratio)
- ✅ **Ingen crop behövs** - bilder passar exakt
- ✅ **Samma pris** (299kr) men bättre produkt
- ✅ **Gelato kostnad: 128kr** (från 140kr A3)

## 💰 Uppdaterad Kostnadskalkyl

### **Per Order:**
```
Digital (79kr):
- Tech kostnad: 1.4 kr
- Stripe fee: 2.5 kr  
- Profit: 75.1 kr (95% marginal)

Print (299kr):
- Tech kostnad: 1.4 kr
- Gelato: 128 kr (produkt + frakt)
- Stripe fee: 6.2 kr
- Profit: 163.4 kr (55% marginal)
```

### **Förbättringar:**
- **Digital**: Lägre pris, samma marginal
- **Print**: Bättre format, högre marginal (163kr vs 151kr)
- **Enklare val**: 2 tiers istället för 3

## 🎨 Tekniska Förändringar

### **Gelato Integration:**
- **Produkt**: Premium poster med matt papper
- **Storlek**: 30x45 cm (12x18")
- **Format**: Perfekt för OpenAI's 1024x1536 bilder
- **Leverans**: 2-4 arbetsdagar inom Sverige

### **TextEditor Uppdatering:**
```typescript
// Uppdatera pricing tiers
const PRICE_TIERS = {
  digital: {
    price: 7900, // 79 kr in öre
    name: 'Digital Poster',
    description: 'Högupplöst fil för hemutskrift (1024x1536px)',
  },
  print: {
    price: 29900, // 299 kr
    name: '30x45cm Premium Print',
    description: 'Professionellt tryck på premium matt papper, levereras hem',
  },
}
```

## 🚀 Implementation Status

### **Redo för Stripe Integration:**
- ✅ **Priser fastställda**: 79kr / 299kr
- ✅ **Format optimerat**: 30x45cm för AI-bilder
- ✅ **Gelato konto**: Skapat och testat
- ✅ **Kostnadskalkyl**: Validerad med faktiska priser

### **Nästa steg:**
1. **Stripe setup** - API keys och webhook
2. **Cloudflare R2** - bildlagring  
3. **TextEditor update** - pricing tiers
4. **Test order** - kvalitetskontroll via Gelato
5. **Deploy & launch** - första riktiga kunder!

## 📊 Expected Performance

### **Conversion Estimates:**
- **Digital tier**: 10-15% (låg tröskel, instant gratification)
- **Print tier**: 3-5% (premium produkt, högre commitment)
- **Blended AOV**: ~120kr (mix av 79kr + 299kr)

### **Monthly Projection (500 visitors):**
- **50 digital orders**: 3,950kr revenue, 3,755kr profit
- **20 print orders**: 5,980kr revenue, 3,268kr profit
- **Total**: 9,930kr revenue, 7,023kr profit (71% margin)

---

*Uppdaterat: 23 juni 2025*  
*Status: Redo för Stripe implementation*  
*Nästa: Technisk implementation & test-order*
