# Manual Print Fulfillment Guide - PetMemories
*Skapad: 26 juni 2025*

## 🖨️ ÖVERSIKT

Manual fulfillment-rutinen hanterar alla print-beställningar (299kr tier) från det att de betalas till att de levereras till kund. 

**Tillgång:** `/admin/fulfillment` (kräver admin-inloggning)

## 📋 5-STEGS PROCESS

### 1. **PENDING** (Ny beställning)
**När:** Beställning precis bekräftad via Stripe
**Vad du ska göra:**
- Kontrollera att filen finns i `paid_orders/`
- Verifiera att leveransadress är komplett
- Kolla att allt ser korrekt ut

### 2. **UPLOADED** (Fil uppladdad till Gelato)
**När:** Du har laddat upp filen till Gelato
**Vad du ska göra:**
- Logga in på [Gelato Dashboard](https://gelato.com)
- Ladda upp poster-filen (ladda ner från `/api/download/[sessionId]`)
- Ange kundadress och kontaktinfo
- **VIKTIGT:** Spara Gelato Order ID från deras system
- Klicka "Markera uppladdad" och ange Gelato Order ID

### 3. **PRINTED** (Poster är tryckt)
**När:** Gelato bekräftar att postern är tryckt
**Vad du ska göra:**
- Vänta på uppdatering från Gelato
- Klicka "Markera tryckt" när du får bekräftelse

### 4. **SHIPPED** (Skickad till kund)
**När:** Gelato skickar iväg paketet
**Vad du ska göra:**
- Lägg till tracking number från Gelato
- Klicka "Markera skickad"
- (Optionellt) Skicka email till kund med tracking info

### 5. **DELIVERED** (Levererad)
**När:** Paketet nått kunden
**Vad du ska göra:**
- Markera som levererad när bekräftat
- Beställning är klar

## 🔧 TEKNISKA DETALJER

### Datalagring
- Fulfillment-status lagras i minnet (försvinner vid restart)
- I produktion: implementera databas för persistent lagring
- Stripe-metadata innehåller: orderId, fileName, petName, style, shipping

### API Endpoints
- `GET /api/admin/fulfillment` - Hämta alla print-orders
- `POST /api/admin/fulfillment` - Uppdatera fulfillment-status

### Säkerhet
- Kräver ADMIN_SECRET_KEY i auth header
- Samma inloggning som admin dashboard

## 📦 GELATO INTEGRATION

### Print-specifikationer
- **Format:** 30x45cm (A3+)
- **Papper:** Premium Matt, 200gsm
- **Fil-krav:** PNG, minst 300 DPI
- **Våra filer:** 1024x1536px (hög kvalitet)

### Gelato Workflow
1. Logga in på gelato.com
2. "Create new order" → "Upload files"
3. Ladda upp poster-fil
4. Välj "Premium Matt 200gsm"
5. Ange kundadress (kopiera från fulfillment-sidan)
6. Lägg order → Spara Order ID

## 🚨 FELSÖKNING

### Vanliga problem
- **Ingen leveransadress:** Kontakta kund via email
- **Fil saknas:** Kolla admin dashboard för fil-status
- **Gelato order misslyckad:** Kontrollera fil-format och storlek

### Kontakt vid problem
- **Tekniskt:** Kolla admin dashboard debug-info
- **Kundservice:** Använd customer email från beställning
- **Gelato support:** Deras chat på gelato.com

## 📧 KUNDKOMMUNIKATION

### Automatiska emails (Stripe)
- Orderbekräftelse skickas automatiskt
- Kvitto med order-info

### Manuella emails (vid behov)
```
Ämne: Din PetMemories poster är på väg! 

Hej [Kundnamn],

Din AI-poster av [Husdjur] är nu tryckt och på väg till dig!

Tracking number: [TRACKING]
Beräknad leverans: 2-4 arbetsdagar

Tack för din beställning!
/Viktor, PetMemories
```

## 🔄 BACKUP RUTINER

### Daglig kontroll
- Kolla fulfillment-sidan för nya pending orders
- Uppdatera status baserat på Gelato-notiser
- Svara på kundfrågor

### Veckovis
- Verifiera alla shipped orders är delivered
- Arkivera slutförda beställningar
- Kontrollera Gelato-fakturor

## 📈 FRAMTIDA FÖRBÄTTRINGAR

### Automatisering
- Gelato API integration för auto-upload
- Tracking email automation
- Status sync mellan Gelato och vårt system

### Databas
- PostgreSQL tabell för fulfillment_status
- Orderhistorik och analytics
- Customer support ticket system

---

**Status:** Implementerat och redo för production
**Nästa steg:** Testa med första riktiga print-order
