# Rate Limiting Setup Instructions

## 1. Lägg till i .env.local

```bash
# Lägg till denna rad i din .env.local fil:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Du hittar din service role key i Supabase Dashboard → Settings → API → service_role secret key.

## 2. Kör SQL Schema i Supabase

Gå till Supabase Dashboard → SQL Editor och kör innehållet från `rate-limit-schema.sql`.

## 3. Testa Rate Limiting

1. Gå till `/generera`
2. Ladda upp en bild och generera AI-poster
3. Efter 3 genereringar bör du se rate limit-meddelandet
4. Usage counter visas under fil-upload

## 4. Reset Usage (för testing)

```sql
-- Kör i SQL Editor för att nollställa din usage för testing
DELETE FROM daily_usage WHERE ip = 'din_ip_address';
```

## 5. Implementation Details

- **3 AI-genereringar per IP per dag**
- **2 bilder per generering** = totalt 6 bilder per dag
- **Reset vid betalning** ger +5 bonus-genereringar
- **Automatic cleanup** av gamla entries
- **Graceful fallback** vid databas-fel (tillåter request)

## Funktioner som skapats:

### Databas:
- `daily_usage` table
- `increment_usage()` function
- `reset_usage_for_paid()` function
- `get_usage()` function

### API Routes:
- `/api/preview` - Nu med rate limiting
- `/api/usage` - Hämta current usage

### UI Components:
- Usage counter i generera-sidan
- Rate limit error meddelanden
- Bonus credits info

## Next Steps:

1. Implementera reset i Stripe webhook när betalning genomförs
2. Testa hela flödet från rate limit → purchase → bonus credits
3. Monitor usage i Supabase dashboard

Rate limiting är nu implementerat och redo för testing! 🚀
