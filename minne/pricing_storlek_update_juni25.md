# Pricing Update - Storlek-baserad Prissättning
*Datum: 25 juni 2025*

## 🎯 Ny Prisstrategi - Storlek-driven

### **Digital Download: 79kr (oförändrat)**
- Högupplöst fil (1024x1536px)
- Instant nedladdning
- Perfekt för hemutskrift
- Livstids åtkomst

### **Premium Print: FRÅN 299kr (storlek-baserat)**

#### **Print Storlekar & Priser:**
- **30x45cm (A3+)**: 299kr - **Standard/Populär**
- **40x60cm (Större)**: 399kr - **Premium**
- **50x75cm (XL)**: 499kr - **Premium XL**

*(Exakta storlekar och priser baserat på Gelato's utbud och kostnad per storlek)*

## 💰 Kostnadskalkyl per Storlek

### **Digital (79kr):**
- Tech kostnad: 1.4kr
- Stripe fee: 2.5kr
- **Profit: 75.1kr (95% marginal)**

### **Print Storlekar:**

#### **30x45cm (299kr):**
- Tech kostnad: 1.4kr
- Gelato kostnad: ~128kr
- Stripe fee: 6.2kr
- **Profit: 163.4kr (55% marginal)**

#### **40x60cm (399kr):**
- Tech kostnad: 1.4kr
- Gelato kostnad: ~180kr (uppskattat)
- Stripe fee: 8.3kr
- **Profit: 209.3kr (52% marginal)**

#### **50x75cm (499kr):**
- Tech kostnad: 1.4kr
- Gelato kostnad: ~240kr (uppskattat)
- Stripe fee: 10.4kr
- **Profit: 247.2kr (50% marginal)**

## 🎨 Produktvalidering Status

### **Vad som är klart:**
✅ **AI-generation optimerad** (medium quality)
✅ **Text editor implementation** 
✅ **Stripe integration ready**
✅ **Cloudflare R2 setup**
✅ **4-6x skalning testad** - Beställde fysiska testprodukter

### **Vad som återstår för produktvalidering:**
1. **Favicon** - Professionell webbplats-ikon
2. **Social media preview-bild** - Open Graph/Twitter Cards
3. **Eventuellt:** FAQ-optimering, "Om oss"-sektion

### **När fysiska testprodukter kommer:**
- **Om kvalitet OK**: Produktvalidering KLAR ✅
- **Fokus skiftar till**: Marketing & kundakquisition
- **Nästa fas**: Skalning & automatisering

## 🛠️ Teknisk Implementation

### **TextEditor Update behövs:**
```typescript
const PRINT_SIZES = {
  small: {
    size: '30x45cm',
    price: 29900, // 299kr
    name: 'Standard Print',
    description: 'Perfekt för vardagsrum eller sovrum'
  },
  medium: {
    size: '40x60cm', 
    price: 39900, // 399kr
    name: 'Premium Print',
    description: 'Imponerande storlek för större utrymmen'
  },
  large: {
    size: '50x75cm',
    price: 49900, // 499kr  
    name: 'XL Print',
    description: 'Iögonfallande centerpiece'
  }
}
```

### **Landing Page Update:**
- Uppdatera "Från 299kr" till "Från 299kr" (tekniskt samma men tydliggör att det finns större storlekar)
- Lägg till storlek-väljare i pricing-sektion

## 📊 Expected Impact

### **Fördelar med storlek-baserad prissättning:**
- **Högre AOV**: Kunder kan välja premium-storlekar
- **Bättre marginal**: Större posters ger mer profit
- **Flexibilitet**: Anpassar sig till olika behov/rum
- **Premium positioning**: Visar att vi är seriösa/professionella

### **Konversion Estimates:**
- **Digital (79kr)**: 15% av visitors
- **Standard Print (299kr)**: 5% av visitors  
- **Premium Print (399kr)**: 2% av visitors
- **XL Print (499kr)**: 1% av visitors

### **Genomsnittlig ordervalue:**
```
15 digital × 79kr = 1,185kr
5 standard × 299kr = 1,495kr  
2 premium × 399kr = 798kr
1 XL × 499kr = 499kr
Total: 3,977kr / 23 orders = 173kr AOV
```

**Vs tidigare AOV (~120kr) = +44% förbättring**

## 🚀 Nästa Steg

### **Denna vecka (efter fysiska samples):**
1. **Kvalitetskontroll** av testprodukter
2. **Favicon & social media assets**
3. **Storlek-väljare** i TextEditor
4. **Landing page** uppdatering med nya storlekar

### **Nästa vecka (om kvalitet OK):**
1. **Launch första kampanj**
2. **Mät conversion per storlek**
3. **Optimera baserat på data**

---

*Status: Väntar på fysiska testprodukter för final kvalitetsvalidering*
*Teknisk implementation: 95% klar*
*Produktvalidering: 90% klar (väntar på samples)*