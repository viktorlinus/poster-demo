# AI Poster Generation Research - Session Summary

## 🎯 Projektmål
Utveckla en AI-driven poster-generation tjänst som kan skapa konstnärliga tolkningar av porträttbilder med olika stilar (akvarell, oljemålning, blyerts, etc.) för print-on-demand-affär.

## 🔧 Teknisk Implementation

### API-struktur
- **Backend**: Next.js API routes med OpenAI integration
- **Models**: GPT-4.1-mini (vision), gpt-image-1 (generation/editing)
- **Framework**: React med TypeScript

### Två utvecklade metoder:
1. **Edit-metoden**: Redigerar originalbilden direkt med `images.edit()`
2. **Vision + Generate-metoden**: Använder GPT-4.1-mini för bildbeskrivning → `images.generate()`

## 📊 Testresultat och Lärdomar

### Initiala barnporträtt-tester
**Problem identifierade:**
- **Content policy-blockeringar**: 50-75% av anrop misslyckades
- **Dålig igenkänning**: Lyckade bilder såg inte ut som originalet
- **Inkonsekvent success rate**: Även optimerade prompts gav opålitliga resultat

**Prompt-optimeringar testade:**
1. Historiska konsttermer ("Renaissance portraiture")
2. Tekniska beskrivningar ("classical composition")
3. Minimalistiska prompts (endast stilnamn)
4. Cache-implementering för att minska kostnader

**Resultat**: Förbättring från 50% → 75% success rate, men fortfarande opålitligt.

### Pivot till husdjursporträtt
**Motivation**: ChatGPT-analys visade att husdjur inte har samma policy-begränsningar som människoporträtt, särskilt barn.

**Implementering:**
- Anpassade vision-prompts för djurspecifika drag
- Justerade stilprompts för "pet portrait"
- Lade till "Pet Memories"-variant för memorialis

**Resultat**: 100% success rate för alla fyra promptvarianter.

### Metodjämförelse - Husdjursporträtt

**Edit-metoden:**
- ✅ **Överlägsen individ-igenkänning**: Kunden känner igen sitt specifika husdjur
- ✅ **Bevarar unika ansiktsdrag** och personlighet
- ✅ **Konsekvent kvalitet** med akvarellstil
- ⚠️ Begränsad till redigering av befintlig bild

**Vision + Generate-metoden:**
- ✅ **Tekniskt snyggare resultat** med bättre komposition
- ✅ **Rasigenkänning** fungerar väl (identifierade "Staffordshire Bull Terrier")
- ✅ **Professionell bildkvalitet** med bättre ljussättning
- ❌ **Förlorar individuell igenkänning** - blir mer generisk

## 💰 Affärsinsikter

### Content Policy som affärshinder
- **Mänskliga porträtt** (särskilt barn) är problematiska för AI-generering
- **Husdjursporträtt** har minimal policy-begränsning
- **Emotional value** är lika hög för husdjur som för familjemedlemmar

### Målgruppsanalys
- **Pet owners**: 1.6M svenska hushåll
- **Memorial market**: Känslomässigt laddad nisch
- **Repeat business**: Flera husdjur + memorial när djur avlider

### Teknisk arkitektur-lärdomar

**Optimeringar implementerade:**
- **Smart caching**: Undviker redundanta vision API-anrop (sparar 75% kostnader)
- **Parameterjustering**: `moderation: "low"` för generate, `quality: "low"` för kostnadseffektivitet
- **Poster-formatering**: 20% tom yta i botten för text

## 🚀 Rekommendationer

### Immediate Actions
1. **Fokusera på husdjursporträtt** som primär marknad
2. **Använd Edit-metoden** för bästa individ-igenkänning
3. **Implementera text-overlay** för personalisering (namn, årtal, memorial text)

### Product Development
- **Stilvariation**: Utöka från akvarell till oljemålning, blyerts, digital art
- **Pricing strategy**: 499-799 kr baserat på kvalitetsnivå
- **Memorial positioning**: "Pet Memories" som emotional brand

### Technical Next Steps
- **A/B-testa** olika prompt-formuleringar för maximal igenkänning
- **Implementera** högre kvalitet för slutproduktion (`quality: "high"`)
- **Utveckla** text-overlay system för personalisering

## 📈 Mätbara Resultat

| Metrik | Barnporträtt | Husdjursporträtt |
|--------|--------------|------------------|
| Success Rate | 50-75% | 100% |
| Igenkänning | Dålig | Utmärkt (Edit) |
| Policy-blockeringar | Frekventa | Inga |
| Teknisk komplexitet | Hög | Låg |
| Affärspotential | Begränsad | Hög |

## 🎯 Slutsats

**Pet Memories-konceptet** med Edit-metoden visar störst potential för en viable AI poster-business. Kombinationen av teknisk tillförlitlighet, stark emotional value proposition, och minimal regulatory friction gör detta till en stark affärsmöjlighet.

**Key Success Factor**: Individ-igenkänning över teknisk perfektion - kunder värdesätter att känna igen sitt specifika husdjur mer än bildkvalitet.