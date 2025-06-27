import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                PetMemories
              </span>
            </div>
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Tillbaka till startsidan</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Integritetspolicy
          </h1>
          
          <div className="text-sm text-gray-600 mb-8 text-center">
            Senast uppdaterad: 24 juni 2025
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Allmän information</h2>
              <p>
                PetMemories (&quot;vi&quot;, &quot;oss&quot;, &quot;vår&quot;) respekterar din integritet och är engagerade i att skydda dina personuppgifter. 
                Denna integritetspolicy förklarar hur vi samlar in, använder, lagrar och skyddar dina uppgifter när du 
                använder vår AI-poster-tjänst.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uppgifter vi samlar in</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Uppgifter du ger oss</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Husdjursfoton:</strong> Bilder du laddar upp för AI-bearbetning</li>
                <li><strong>Kontaktuppgifter:</strong> E-postadress för orderbekräftelser och leveranser</li>
                <li><strong>Leveransuppgifter:</strong> Namn och adress (endast för fysiska prints)</li>
                <li><strong>Betalningsuppgifter:</strong> Hanteras säkert av Stripe (vi lagrar inga kortuppgifter)</li>
                <li><strong>Text och metadata:</strong> Eventuell text du lägger till på posters, husdjursnamn, stilval</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">2.2 Teknisk information</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Användningsdata:</strong> IP-adress, webbläsartyp, besökstider för att förhindra missbruk</li>
                <li><strong>Rate limiting:</strong> Spårning av antal AI-genereringar per användare (3 per dag)</li>
                <li><strong>Cookies:</strong> Tekniska cookies för sessionhantering och användarupplevelse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hur vi använder dina uppgifter</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Tjänsteleverans:</strong> Skapa AI-genererade posters från dina husdjursfoton</li>
                <li><strong>Orderhantering:</strong> Behandla betalningar och leverera digitala eller fysiska produkter</li>
                <li><strong>Kundservice:</strong> Svara på frågor och lösa eventuella problem</li>
                <li><strong>Kvalitetssäkring:</strong> Förbättra vår AI-teknik och tjänstekvalitet</li>
                <li><strong>Säkerhet:</strong> Förhindra missbruk och bedrägerier</li>
                <li><strong>Kommunikation:</strong> Skicka orderbekräftelser och leveransuppdateringar</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Lagring och säkerhet</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Datalagring</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Husdjursfoton:</strong> Lagras säkert i Cloudflare R2 med kryptering</li>
                <li><strong>Automatisk radering:</strong> Ursprungsfoton raderas efter 30 dagar</li>
                <li><strong>Slutliga posters:</strong> Bevaras permanent för återköp och kundservice</li>
                <li><strong>Betalningsdata:</strong> Hanteras av Stripe enligt PCI DSS-standard</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">4.2 Säkerhetsåtgärder</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li>SSL-kryptering för all dataöverföring</li>
                <li>Säker molnlagring med åtkomstbegränsningar</li>
                <li>Regelbundna säkerhetsupdateringar och övervakning</li>
                <li>Begränsad personalåtkomst endast vid behov</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Delning med tredje part</h2>
              <p className="mb-4">
                Vi delar <strong>aldrig</strong> dina husdjursfoton eller personliga uppgifter med tredje part för 
                marknadsföringsändamål. Begränsad delning sker endast för:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Stripe:</strong> Säker betalningsbehandling (följer PCI DSS)</li>
                <li><strong>OpenAI:</strong> AI-bearbetning av foton (automatiskt raderade efter bearbetning)</li>
                <li><strong>Tryckpartners:</strong> Leverans av fysiska posters (endast namn och adress)</li>
                <li><strong>Cloudflare:</strong> Säker lagring och leverans av tjänsten</li>
                <li><strong>Rättsliga krav:</strong> Om det krävs enligt lag eller domstolsbeslut</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Dina rättigheter (GDPR)</h2>
              <p className="mb-4">Du har rätt att:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Få tillgång:</strong> Begära kopia av dina personuppgifter</li>
                <li><strong>Rätta uppgifter:</strong> Korrigera felaktiga eller ofullständiga uppgifter</li>
                <li><strong>Radera data:</strong> Begära att vi raderar dina uppgifter (&quot;rätten att bli glömd&quot;)</li>
                <li><strong>Begränsa behandling:</strong> Begära att vi begränsar användningen av dina uppgifter</li>
                <li><strong>Dataportabilitet:</strong> Få dina uppgifter i ett strukturerat format</li>
                <li><strong>Invända:</strong> Motsätta dig behandling av dina uppgifter</li>
                <li><strong>Återkalla samtycke:</strong> När som helst återkalla ditt samtycke</li>
              </ul>
              
              <p className="mt-4">
                För att utöva dessa rättigheter, kontakta oss på: 
                <a href="mailto:info@petmemories.se" className="text-orange-600 hover:text-orange-700 font-semibold">
                  info@petmemories.se
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies och spårning</h2>
              <p className="mb-4">Vi använder följande typer av cookies:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Nödvändiga cookies:</strong> För grundläggande webbplatsfunktionalitet</li>
                <li><strong>Rate limiting:</strong> För att förhindra missbruk av AI-tjänsten</li>
                <li><strong>Session cookies:</strong> För att komma ihåg dina val under besöket</li>
              </ul>
              <p className="mt-4">
                Vi använder <strong>inte</strong> marknadsförings- eller analyticscookies från tredje part.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Internationella överföringar</h2>
              <p>
                Dina uppgifter kan behandlas i servrar utanför EU/EES genom våra tjänsteleverantörer 
                (Cloudflare, OpenAI, Stripe). Alla överföringar sker med lämpliga skyddsåtgärder enligt GDPR, 
                inklusive standardavtalsklausuler och adekvata skyddsnivåer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Barn och minderåriga</h2>
              <p>
                Vår tjänst är avsedd för personer över 18 år. Vi samlar inte medvetet in personuppgifter 
                från barn under 16 år utan föräldrars samtycke. Om du är förälder och upptäcker att ditt 
                barn har lämnat personuppgifter till oss, kontakta oss så raderar vi informationen omedelbart.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Ändringar av policyn</h2>
              <p>
                Vi kan uppdatera denna integritetspolicy från tid till annan. Väsentliga ändringar kommer 
                att meddelas via e-post eller genom tydlig information på vår webbplats. Ditt fortsatta 
                användande av tjänsten efter ändringar innebär att du accepterar den uppdaterade policyn.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Kontaktinformation</h2>
              <p className="mb-4">
                Om du har frågor om denna integritetspolicy eller hur vi hanterar dina personuppgifter, 
                kontakta oss:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>PetMemories</strong></p>
                <p>E-post: <a href="mailto:info@petmemories.se" className="text-orange-600 hover:text-orange-700 font-semibold">info@petmemories.se</a></p>
              </div>
              
              <p className="mt-4">
                Du har också rätt att lämna in klagomål till Integritetsskyddsmyndigheten (IMY) om du 
                anser att vi behandlar dina personuppgifter felaktigt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Rättslig grund för behandling</h2>
              <p className="mb-4">Vi behandlar dina personuppgifter baserat på:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Kontraktsuppfyllelse:</strong> För att leverera AI-poster-tjänsten du beställt</li>
                <li><strong>Berättigat intresse:</strong> För att förhindra missbruk och förbättra tjänsten</li>
                <li><strong>Samtycke:</strong> För marknadsföringskommunikation (kan återkallas)</li>
                <li><strong>Rättslig förpliktelse:</strong> För bokföring och skatteändamål</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}