# Database Logging & KPI System Implementation
*Genomförd: 26 juni 2025*

## 🎯 Vad vi implementerade

### **1. Stripe Orders Tabell för KPI-tracking**
- ✅ Skapade `stripe_orders` tabell för att logga alla beställningar
- ✅ Uppdaterade Stripe webhook för att spara order-data automatiskt
- ✅ Non-blocking databas-insert (failar inte file processing om DB är nere)

**Tabell schema:**
```sql
CREATE TABLE stripe_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  amount_sek DECIMAL(8,2) NOT NULL,
  tier TEXT NOT NULL,
  customer_email TEXT,
  pet_name TEXT,
  style TEXT,
  order_id TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Kategori-spårning för AI-generationer**
- ✅ Lade till `category` kolumn i `daily_usage` tabellen
- ✅ Ändrade primary key till `(ip, date, category)` för separata rader per kategori
- ✅ Uppdaterade RPC-funktioner för korrekt kategori-hantering
- ✅ Modifierade frontend för att skicka style-kategori vid usage increment
- ✅ **FIXAT:** Rate limiting fungerar nu korrekt med kategori-spårning

**Kategori-implementation:**
```sql
-- Primary key ändrad för separata rader per kategori
ALTER TABLE daily_usage DROP CONSTRAINT daily_usage_pkey;
ALTER TABLE daily_usage ADD PRIMARY KEY (ip, date, category);

-- RPC-funktion för korrekt increment + total count
CREATE OR REPLACE FUNCTION increment_usage(_ip text, _date date, _category text DEFAULT 'watercolor')
RETURNS integer AS $
DECLARE
    total_count integer;
BEGIN
    INSERT INTO daily_usage (ip, date, count, category, created_at)
    VALUES (_ip, _date, 1, _category, NOW())
    ON CONFLICT (ip, date, category) 
    DO UPDATE SET count = daily_usage.count + 1;
    
    -- Returnera TOTAL count för alla kategorier
    SELECT sum(count) INTO total_count
    FROM daily_usage 
    WHERE ip = _ip AND date = _date;
    
    RETURN total_count;
END;
$ LANGUAGE plpgsql;

-- Get usage summerar över alla kategorier
CREATE OR REPLACE FUNCTION get_usage(_ip text, _date date)
RETURNS integer AS $
DECLARE
    total_count integer;
BEGIN
    SELECT COALESCE(sum(count), 0) INTO total_count
    FROM daily_usage 
    WHERE ip = _ip AND date = _date;
    
    RETURN total_count;
END;
$ LANGUAGE plpgsql;
```

**Database struktur nu:**
```
-- Exempel på korrekt data:
ip: 123.456, date: 2025-06-26, count: 2, category: 'watercolor'
ip: 123.456, date: 2025-06-26, count: 1, category: 'pastel'

-- Frontend ser: "Du har använt 3 av 3 AI-genereringar idag" (2+1=3)
-- Men vi vet också att 2 var akvarell och 1 var pastel!
```

### **3. Daily KPI View System**
- ✅ Skapade `daily_kpi` view som kombinerar traffic, AI-generationer och orders
- ✅ Korrekt beräkning: `count` = API-calls, `ai_generations` = count * 2
- ✅ Realistisk AI-kostnad: 0.68 kr per genererad bild (inte per API-call)
- ✅ Automatiska konverteringsberäkningar och profit-tracking

**KPI View innehåller:**
- `unique_visitors` - Unika IP-adresser per dag
- `api_calls` - Verkliga OpenAI API-anrop
- `ai_generations` - Totala bilder (2x API-calls)
- `ai_cost_sek` - Kostnad baserat på antal genererade bilder
- `orders` - Antal betalda beställningar
- `revenue_sek` - Total intäkt
- `aov_sek` - Average Order Value
- `conversion_rate_percent` - Visitors → Orders
- `generation_to_order_percent` - AI-genereringar → Orders
- `profit_sek` - Vinst (revenue - AI-kostnad)

### **4. Category Popularity Tracking**
- ✅ Skapade `category_stats` view för att spåra populära stilar
- ✅ Visar antal unika användare, totala generationer och genomsnitt per stil

**Category Stats View:**
```sql
CREATE VIEW category_stats AS
SELECT 
  category,
  count(distinct ip) as unique_users,
  sum(count) as total_generations,
  round(avg(count), 1) as avg_per_user
FROM daily_usage
GROUP BY category
ORDER BY total_generations DESC;
```

## 🚀 Genomfört & Testat

**✅ ALLT FUNGERAR NU KORREKT:**
- Rate limiting visar rätt total count (summerar över alla kategorier)
- Separata rader per kategori i databasen för korrekt spårning
- Frontend ser "Du har använt X av 3 AI-genereringar" korrekt
- Category stats visar riktiga siffror per stil
- KPI dashboard får exakt data per kategori

**Testat scenario:**
- 2x Akvarell + 1x Pastel = "3 av 3 använda" ✅
- Database: 2 separata rader med korrekt kategori ✅
- Rate limit fungerar som förut ✅

### **Dagliga KPI:er:**
```sql
-- Dagens statistik
SELECT * FROM daily_kpi WHERE date = CURRENT_DATE;

-- Senaste veckan
SELECT * FROM daily_kpi 
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;
```

### **Populära stilar:**
```sql
-- Vilka stilar folk föredrar
SELECT * FROM category_stats;
```

### **Business Intelligence:**
- **Lönsamhet per dag** (profit_sek kolumn)
- **Konverteringsgrad** från besökare till köp
- **AI-kostnadskontroll** (verklig kostnad per generering)
- **Stil-preferenser** (vilka kategorier som konverterar bäst)

## 🚨 Uppdaterad TODO för MVP

**✅ KLART - Database Logging:**
- ✅ Stripe orders logging i webhook
- ✅ AI-generation kategori-spårning
- ✅ Daily KPI view system
- ✅ Category popularity tracking

**❌ KVARSTÅENDE KRITISKA ISSUES:**
1. **🚨 Metadata-problem** - Filnamn när ingen text läggs till
2. **📧 Support-email** setup
3. **📋 Manual fulfillment** rutin för print orders
4. **🏢 Impressum** i footer

**❌ MARKETING PREP:**
1. **📊 Meta Pixel** installation
2. **📱 Social media** accounts setup
3. **🎬 Demo reel** produktion
4. **💰 Rabattkod "BETA50"** i Stripe

## 🎯 Nästa fokus

Med database logging nu på plats kan du:
1. **Få verklig data** på vilka stilar som fungerar bäst
2. **Optimera AI-kostnader** baserat på verkliga siffror
3. **Spåra lönsamhet** dag för dag
4. **Identifiera** flaskhalsar i conversion funnel

**Status: 80% av MVP-checklist klar** (tidigare 75%)
*Database logging & KPI system = helt implementerat och fungerande*
