'use client';
import React from 'react';
import { Heart, Camera, Palette, Home, Star, ArrowRight, Check, Shield, Clock, Truck } from 'lucide-react';
import Link from 'next/link';

export default function NewHomePage() {
  const styles = [
    { name: 'Akvarell', desc: 'Mjuk & tidlös', emoji: '🎨', example: 'Vattenfärger flyter samman i mjuka toner' },
    { name: 'Blyerts', desc: 'Klassisk elegans', emoji: '✏️', example: 'Detaljerade skuggningar och linjer' },
    { name: 'Oljemålning', desc: 'Rik & djup', emoji: '🖼️', example: 'Texturrik och livfull målning' },
    { name: 'Kolritning', desc: 'Dramatisk kraft', emoji: '⚫', example: 'Starka kontraster och uttryck' },
    { name: 'Pastell', desc: 'Varm atmosfär', emoji: '🌈', example: 'Mjuka pastellfärger och ljus' },
    { name: 'Cartoon', desc: 'Lekfull & vibrant', emoji: '🎭', example: 'Färgglad illustration-stil' }
  ];

  const testimonials = [
    {
      name: "Maria, Stockholm",
      text: "Bella&apos;s akvarellporträtt hänger nu i vårt vardagsrum. Tårarna kom direkt - det fångade hennes själ perfekt.",
      pet: "Bella (Golden Retriever)",
      stars: 5
    },
    {
      name: "Erik, Göteborg", 
      text: "När Milo gick bort ville vi ha något vackert att minnas honom med. Denna poster blev så mycket mer än ett foto.",
      pet: "Milo (Katt)",
      stars: 5
    },
    {
      name: "Anna, Malmö",
      text: "Fantastisk kvalitet! Levererades snabbt och ser precis ut som vår Charlie. Kommer definitivt beställa fler.",
      pet: "Charlie (Fransk bulldogg)",
      stars: 5
    }
  ];

  const processSteps = [
    {
      step: "1",
      icon: <Camera className="w-8 h-8 text-blue-600" />,
      title: "Ladda upp foto",
      desc: "Välj ditt favoritfoto av ditt husdjur"
    },
    {
      step: "2", 
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      title: "AI skapar konst",
      desc: "Välj stil och låt AI förvandla bilden"
    },
    {
      step: "3",
      icon: <Home className="w-8 h-8 text-green-600" />,
      title: "Levereras hem",
      desc: "Digital fil direkt eller tryck levererat"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="px-4 pt-12 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 mb-6">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700">Över 500 lyckliga husdjursägare</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Förvandla ditt älskade husdjur till 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500"> evig konst</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Vackra AI-skapade posters som hedrar ditt husdjurs minne. Från vanligt foto till konstminnning på 5 minuter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/generera">
              <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                Skapa min poster nu
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <button className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 transition-colors">
              Se exempel
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Säker betalning</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>5 minuters process</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-500" />
              <span>Snabb leverans</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Så enkelt fungerar det
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="w-8 h-8 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Gallery */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Välj din stil
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Varje stil skapar en unik känsla. Från klassisk elegans till modern konst.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {styles.map((style, index) => (
              <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="text-3xl md:text-4xl mb-3">{style.emoji}</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{style.name}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3">{style.desc}</p>
                <p className="text-xs md:text-sm text-gray-500">{style.example}</p>
                <div className="mt-4 text-orange-600 font-semibold">Från 79kr</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Transparenta priser
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Digital Package */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-200">
              <div className="text-center">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Digital</h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">79kr</div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Högupplöst fil (1024x1536px)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Instant nedladdning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Perfekt för hemutskrift</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Livstids åtkomst</span>
                  </li>
                </ul>
                <Link href="/generera">
                  <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Välj Digital
                  </button>
                </Link>
              </div>
            </div>

            {/* Print Package */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-xl border-2 border-orange-200 relative">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Populärast
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Print</h3>
                <div className="text-3xl font-bold text-orange-600 mb-4">299kr</div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">30x45cm Premium Matt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Professionellt tryck</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Leverans 2-4 dagar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Inkluderar digital fil</span>
                  </li>
                </ul>
                <Link href="/generera">
                  <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    Välj Premium Print
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Vad våra kunder säger
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.pet}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Hedra ditt husdjurs minne idag
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Vissa minnen förtjänar att bevaras för evigt. Skapa en vacker konstminnning som du kommer att älska i många år framöver.
          </p>
          <Link href="/generera">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 mx-auto">
              Skapa din poster nu
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Pet Memories</h3>
          <p className="text-gray-400 mb-6">Förvandla kärlek till konst</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>© 2025 Pet Memories</span>
            <span>•</span>
            <span>Integritetspolicy</span>
            <span>•</span>
            <span>Villkor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
