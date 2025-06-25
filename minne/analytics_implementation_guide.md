# Analytics Integration Guide - 25 juni 2025

## 🔧 Hur du lägger till analytics i befintliga komponenter

### **I AI Generator (generera/page.tsx):**
```typescript
import { businessEvents } from '@/lib/analytics';

// När AI-generation startar:
const handleGenerate = () => {
  businessEvents.aiGenerationStarted(selectedStyle);
  // ... din befintliga kod
};

// När AI-generation slutförs:
const onGenerationComplete = () => {
  const timeSpent = Date.now() - startTime;
  businessEvents.aiGenerationCompleted(selectedStyle, timeSpent);
  // ... din befintliga kod
};
```

### **I TextEditor komponenten:**
```typescript
import { businessEvents } from '@/lib/analytics';

// När text editor öppnas:
useEffect(() => {
  businessEvents.textEditorOpened();
}, []);

// När pricing tier visas:
const handleTierChange = (tier: string) => {
  businessEvents.pricingViewed(tier);
  // ... din befintliga kod
};
```

### **I Stripe Checkout:**
```typescript
import { businessEvents } from '@/lib/analytics';

// När checkout startar:
const handleCheckout = (tier: string, amount: number) => {
  businessEvents.checkoutStarted(tier, amount);
  // ... din befintliga Stripe kod
};
```

### **I Success Page:**
```typescript
import { businessEvents } from '@/lib/analytics';

// När order slutförs:
useEffect(() => {
  if (orderData) {
    businessEvents.orderCompleted(
      orderData.id,
      orderData.tier,
      orderData.amount,
      orderData.style
    );
  }
}, [orderData]);
```

## 📊 Vad som spåras automatiskt:
- **Page views** - Alla sidvisningar
- **User sessions** - Användaraktivitet  
- **Device info** - Mobil/desktop, webbläsare
- **Traffic sources** - Varifrån folk kommer
- **Geografi** - Vilket land/stad (anonymiserat)

## 🎯 Vad du manuellt kan spåra:
- **AI Generation** - Vilka stilar som är populära
- **Text Editor Usage** - Hur många som lägger till text
- **Pricing Interactions** - Vilka priser folk tittar på
- **Checkout Funnel** - Var folk faller bort
- **Purchase Conversions** - Exakta intäkter per stil/tier

## 🚀 Setup för produktion:

### 1. Skapa Google Analytics konto:
1. Gå till https://analytics.google.com
2. Skapa nytt konto för "PetMemories"
3. Lägg till property för "petmemories.se"
4. Kopiera **Measurement ID** (börjar med G-XXXXXXXXXX)

### 2. Lägg till i Vercel environment variables:
```
NEXT_PUBLIC_GA_ID=G-DIN_RIKTIGA_ID_HÄR
```

### 3. Analytics börjar fungera direkt!
- **Real-time data** i Google Analytics dashboard
- **E-commerce tracking** för alla köp
- **Conversion funnels** för optimering

## 📋 Viktiga metrics att övervaka:

### **Traffic Metrics:**
- **Unique visitors** per dag/vecka
- **Session duration** - hur länge folk stannar
- **Bounce rate** - folk som lämnar direkt
- **Traffic sources** - Facebook ads, Google, direkt

### **Conversion Funnel:**
- **Homepage → Upload** - % som börjar processen
- **Upload → Text Editor** - % som går till nästa steg  
- **Text Editor → Pricing** - % som når prissättning
- **Pricing → Checkout** - % som startar betalning
- **Checkout → Purchase** - % som slutför köp

### **Business Metrics:**
- **Revenue per visitor** (RPV)
- **Average order value** (AOV)
- **Digital vs Print ratio**
- **Most popular art styles**
- **Best converting traffic sources**

## 🎨 Custom Events för A/B Testing:

```typescript
// Testa olika pricing displays
businessEvents.event({
  action: 'pricing_variant_view',
  category: 'ab_test',
  label: 'compact_vs_detailed',
});

// Testa olika CTA buttons
businessEvents.event({
  action: 'cta_click',
  category: 'ab_test', 
  label: 'create_now_vs_start_generating',
});
```

---

*Status: Analytics 100% redo för implementation*
*Nästa: Lägg till tracking i befintliga komponenter*