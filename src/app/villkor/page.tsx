import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

export default function TermsOfService() {
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
            Användarvillkor
          </h1>
          
          <div className="text-sm text-gray-600 mb-8 text-center">
            Senast uppdaterad: 24 juni 2025
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptans av villkor</h2>
              <p>
                Genom att använda PetMemories AI-poster-tjänst accepterar du dessa användarvillkor. 
                Om du inte accepterar alla villkor får du inte använda tjänsten. Vi förbehåller oss rätten att 
                uppdatera dessa villkor när som helst.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Beskrivning av tjänsten</h2>
              <p className="mb-4">
                PetMemories erbjuder AI-baserad bildbehandling som förvandlar dina husdjursfoton till konstnärliga posters:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li>• AI-generering av konstnärliga posters i 6 olika stilar</li>
                  <li>• 3 gratis genereringar per dag (varje generering ger 2 alternativ)</li>
                  <li>• Valfri texteditor för anpassning</li>
                  <li>• Digital nedladdning (79kr) eller fysisk print (från 299kr)</li>
                  <li>• Säker betalning via Stripe</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Användarregistrering</h2>
              <p>
                Du behöver inte skapa ett konto för att använda tjänsten. Varje session är anonym och 
                baseras på din IP-adress för rate limiting (3 genereringar per 24 timmar). Du är ansvarig 
                för att din e-postadress vid köp är korrekt för leverans av digitala filer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Accepterat innehåll</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Tillåtet innehåll</h3>
                  <ul className="space-y-1 text-green-700">
                    <li>• Foton på dina egna husdjur</li>
                    <li>• Bilder där du har fullständiga rättigheter</li>
                    <li>• Tydliga foton med god kvalitet</li>
                    <li>• Familjevänligt innehåll</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Förbjudet innehåll</h3>
                  <ul className="space-y-1 text-red-700">
                    <li>• Bilder på människor eller barn</li>
                    <li>• Upphovsrättsskyddat material</li>
                    <li>• Våldsamt eller olämpligt innehåll</li>
                    <li>• Politiskt kontroversiellt material</li>
                  </ul>
                </div>
              </div>

              <p className="mt-4 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <strong>Viktigt:</strong> Vi förbehåller oss rätten att avvisa innehåll som bryter mot dessa riktlinjer 
                utan förvarning eller återbetalning.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Priser och betalning</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Digital Poster</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">79kr</div>
                  <ul className="text-sm space-y-1">
                    <li>• Högupplöst fil för nedladdning</li>
                    <li>• Omedelbar leverans</li>
                    <li>• Livstids åtkomst</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Fysisk Print</h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">Från 299kr</div>
                  <ul className="text-sm space-y-1">
                    <li>• Professionellt tryck</li>
                    <li>• Premium matt-papper</li>
                    <li>• Inkluderar digital fil</li>
                    <li>• Leverans 2-4 dagar</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Betalningsvillkor</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• All betalning sker via Stripe</li>
                  <li>• Accepterade metoder: Kort, Apple Pay, Google Pay</li>
                  <li>• Priser inkluderar svensk moms (25%)</li>
                  <li>• Betalning krävs före tillgång till final fil</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Leverans</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📱 Digital leverans</h3>
                  <ul className="space-y-1">
                    <li>• Omedelbar tillgång efter betalning</li>
                    <li>• Säker nedladdningslänk via e-post</li>
                    <li>• Högupplöst fil (1024x1536px)</li>
                    <li>• Lämplig för utskrift upp till A3</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📦 Fysisk leverans</h3>
                  <ul className="space-y-1">
                    <li>• 2-4 arbetsdagar inom Sverige</li>
                    <li>• 5-7 dagar internationellt</li>
                    <li>• Säker förpackning i posterrör</li>
                    <li>• Spårningsinformation via e-post</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Återbetalning och garantier</h2>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Ångerrätt och återbetalningspolicy</h4>
                <div className="text-yellow-700 space-y-2">
                  <p><strong>Viktigt:</strong> Enligt svensk konsumentlagstiftning gäller <strong>EJ ångerrätt</strong> för personligt anpassade varor som skapas specifikt för dig.</p>
                  <p>Då alla AI-posters är unikt skapade baserat på ditt specifika husdjursfoto och anpassning, klassas dessa som personliga varor.</p>
                  <p>Du ser förhandsvisning innan köp och godkänner resultatet genom din beställning.</p>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                <h4 className="font-semibold text-red-800 mb-2">Återbetalning vid problem</h4>
                <p className="text-red-700">
                  Återbetalning sker endast vid tekniska fel, kvalitetsavvikelser som väsentligt avviker från förhandsvisningen, eller skadade fysiska posters.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Kvalitetsgaranti</h4>
                <ul className="text-green-700 space-y-1">
                  <li>• Slutresultat motsvarar preview-kvalitet</li>
                  <li>• Fysiska prints kvalitetskontrolleras</li>
                  <li>• Omtryck eller återbetalning vid leveransproblem</li>
                  <li>• Reklamation inom 14 dagar</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Rättigheter</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Dina rättigheter</h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Du behåller rättigheter till ursprungsfoton</li>
                    <li>• Du äger AI-genererade postern efter köp</li>
                    <li>• Kan användas privat och kommersiellt</li>
                    <li>• Kan beställa ytterligare prints</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">Våra rättigheter</h3>
                  <ul className="text-purple-700 space-y-1">
                    <li>• Vi äger AI-teknologin</li>
                    <li>• Kan använda anonyma exempel för marknadsföring</li>
                    <li>• Rätt att utveckla och förbättra tjänsten</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Användningsbegränsningar</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li><strong>Rate limiting:</strong> Max 3 AI-genereringar per 24 timmar</li>
                  <li><strong>Filstorlek:</strong> Max 10MB per uppladdad bild</li>
                  <li><strong>Filformat:</strong> Endast JPEG, PNG och WebP</li>
                  <li><strong>Användning:</strong> Endast för skapande av husdjursposters</li>
                  <li><strong>Automatisering:</strong> Förbud mot bots eller massuppladdning</li>
                  <li><strong>Återförsäljning:</strong> Ej tillåtet utan skriftligt avtal</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Ansvarsbegränsning</h2>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 mb-3">
                  <strong>Viktigt:</strong> PetMemories tjänst tillhandahålls &quot;som den är&quot; utan garantier. 
                  Vi ansvarar inte för:
                </p>
                <ul className="text-red-700 space-y-1">
                  <li>• Indirekta skador eller följdskador</li>
                  <li>• Förlorade vinster eller affärsmöjligheter</li>
                  <li>• AI-resultat som inte motsvarar förväntningar</li>
                  <li>• Avbrott i tjänsten eller tekniska problem</li>
                </ul>
                <p className="text-red-800 mt-3 font-semibold">
                  Vårt totala ansvar begränsas till det belopp du betalat.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Tredje parts tjänster</h2>
              <p className="mb-3">Vår tjänst använder följande partners:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">OpenAI</div>
                  <div className="text-sm text-gray-600">AI-bildbehandling</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">Stripe</div>
                  <div className="text-sm text-gray-600">Säker betalning</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">Cloudflare</div>
                  <div className="text-sm text-gray-600">Säker lagring</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold">Tryckpartners</div>
                  <div className="text-sm text-gray-600">Posterleverans</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Juridisk information</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Tillämplig lag</h4>
                  <p>Dessa villkor styrs av svensk lag. Tvister avgörs av svensk domstol med Stockholms tingsrätt som första instans.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Ändringar</h4>
                  <p>Vi kan uppdatera dessa villkor när som helst. Väsentliga ändringar meddelas på vår webbplats.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Kontakt</h2>
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 text-center">
                <h3 className="text-xl font-bold text-orange-800 mb-4">Har du frågor?</h3>
                <p className="text-orange-700 mb-4">
                  Kontakta oss om du har frågor om dessa användarvillkor eller vår tjänst.
                </p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <p className="font-semibold text-gray-900">PetMemories</p>
                  <a 
                    href="mailto:viktorlinus@gmail.com" 
                    className="text-orange-600 hover:text-orange-700 font-semibold text-lg"
                  >
                    viktorlinus@gmail.com
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}