'use client';
import React, { useState, useEffect } from 'react';
import { Heart, Camera, Palette, Home, Star, ArrowRight, Check, Shield, Clock, Truck, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import FAQ from '@/components/FAQ';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Riktiga exempel med dina bilder
  const beforeAfterExamples = [
    {
      before: "/images/hundar-innan.jpg",
      after: "/images/hundar-efter.png",
      title: "Charlie & Chloé",
      style: "Akvarell",
      quote: "Vi älskar hur AI fångade båda hundarna perfekt!"
    },
    {
      before: "/images/hund-innan-1.jpg", 
      after: "/images/hund-efter-1.png",
      title: "Chloé",
      style: "Akvarell",
      quote: "Chloé's personlighet skiner verkligen igenom."
    },
    {
      before: "/images/hund-innan-2.jpg",
      after: "/images/hund-efter-2.png", 
      title: "Dyno",
      style: "Akvarell",
      quote: "Perfekt present till mamma!"
    },
    {
      before: "/images/katt-innan.jpg",
      after: "/images/katt-efter.png",
      title: "Whiskers", 
      style: "Kolritning",
      quote: "En vacker minnesak av vår älskade katt."
    },
    {
      before: "/images/hund-innan-3.jpg",
      after: "/images/hund-efter-3.png",
      title: "Chico",
      style: "Akvarell",
      quote: "Kvaliteten överträffade våra förväntningar!"
    }
  ];

  const customerStories = [
    {
      image: "/images/hund-efter-4.png",
      quote: "Vi älskar Bellas nya konstposter i vardagsrummet. Den fångade hennes personlighet perfekt!",
      name: "Anna & Marcus",
      pet: "Bella",
      location: "Stockholm"
    },
    {
      image: "/images/olje-text.png", 
      quote: "Perfekt tavla av vår älskade katt och hund. Kvaliteten överträffade våra förväntningar.",
      name: "Lisa",
      pet: "Tiff & Freja",
      location: "Göteborg"
    },
    {
      image: "/images/hund-efter-2-poster.png",
      quote: "Fantastisk present till mormor.",
      name: "Erik",
      pet: "Chico",
      location: "Malmö"
    }
  ];

  const artStyles = [
    {
      name: "Akvarell",
      emoji: "🎨",
      image: "/images/hundar-efter.png",
      description: "Mjuka, flytande färger",
      example: "Charlie & Chloé"
    },
    {
      name: "Blyerts", 
      emoji: "✏️",
      image: "/images/blyerts-1.png",
      description: "Delikata grafit-streck",
      example: "Bella"
    },
    {
      name: "Oljemålning",
      emoji: "🖌️",
      image: "/images/olje.png", 
      description: "Rik textur och djup",
      example: "Tiff & Freja"
    },
    {
      name: "Kolritning",
      emoji: "⚫",
      image: "/images/kolritning-2.png",
      description: "Mjuka kol-streck",
      example: "Dyno"
    },
    {
      name: "Pastellritning",
      emoji: "🌈",
      image: "/images/pastell-2.png",
      description: "Mjuka pastell-färger",
      example: "Rex"
    },
    {
      name: "Cartoon/Tecknad",
      emoji: "💻",
      image: "/images/cartoon-3.png",
      description: "Lekfull & vibrant",
      example: "Rossi"
    }
  ];

  const processSteps = [
    {
      step: "1",
      icon: <Camera className="w-8 h-8 text-blue-600" />,
      title: "Ladda upp foto",
      desc: "Välj ditt favoritfoto av ditt husdjur",
      example: "/images/hund-innan-1.jpg"
    },
    {
      step: "2", 
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      title: "AI skapar konst",
      desc: "Välj stil och låt AI förvandla bilden",
      example: "/images/hund-efter-1.png"
    },
    {
      step: "3",
      icon: <Home className="w-8 h-8 text-green-600" />,
      title: "Levereras hem",
      desc: "Digital fil direkt eller tryck levererat",
      example: "/images/leverans.jpg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % beforeAfterExamples.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [beforeAfterExamples.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % beforeAfterExamples.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + beforeAfterExamples.length) % beforeAfterExamples.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                PetMemories
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#examples" className="text-gray-600 hover:text-pink-500 transition-colors">Exempel</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-pink-500 transition-colors">Så fungerar det</a>
              <a href="#styles" className="text-gray-600 hover:text-pink-500 transition-colors">Stilar</a>
              <a href="#pricing" className="text-gray-600 hover:text-pink-500 transition-colors">Priser</a>
              <a href="#faq" className="text-gray-600 hover:text-pink-500 transition-colors">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section med Before/After Slider */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 mb-6">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Över 500 lyckliga husdjursägare</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Förvandla ditt{' '}
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  husdjur
                </span>{' '}
                till konstposter
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Avancerad AI förvandlar dina älskade husdjursfoton till unika, professionella konstposter. 
                Perfect som present eller minnessak.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/generera">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Skapa min poster nu
                  </button>
                </Link>
                <button 
                  onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 transition-colors"
                >
                  Se riktiga exempel
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500">
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

            {/* Before/After Slider */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg mx-auto">
                <div className="mb-4 text-center">
                  <span className="text-sm font-medium text-gray-500">Riktigt exempel:</span>
                  <h3 className="text-lg font-bold text-gray-900">{beforeAfterExamples[currentSlide].title} - {beforeAfterExamples[currentSlide].style}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-500 mb-2">INNAN</p>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={beforeAfterExamples[currentSlide].before}
                        alt="Före transformation"
                        width={200}
                        height={267}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-500 mb-2">EFTER</p>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={beforeAfterExamples[currentSlide].after}
                        alt="Efter transformation"
                        width={200}
                        height={267}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 italic">&quot;{beforeAfterExamples[currentSlide].quote}&quot;</p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button 
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex space-x-2">
                    {beforeAfterExamples.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Svenska Konkurrensfördelar */}
      <section className="px-4 py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-semibold mb-4">
                <span className="text-sm">🔥 LANSERINGS-REA</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Varför välja PetMemories?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Vi erbjuder samma kvalitet som traditionella svenska tjänster, men snabbare, billigare och med mer variation.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
              {/* Bild-sektion - visas först på mobil */}
              <div className="text-center lg:order-2">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Professionell AI-konst</h3>
                    <p className="text-gray-600 text-sm">Handgjord kvalitet på 5 minuter</p>
                  </div>
                  
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src="/images/hundar-efter.png"
                      alt="AI-genererad konst - professionell kvalitet"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full">
                      <span className="text-green-600 font-semibold text-sm">✨ AI-genererad på 5 minuter</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Charlie & Chloé - Akvarell stil</p>
                  </div>
                </div>
              </div>

              {/* Jämförelse-kort - visas som andra på mobil */}
              <div className="lg:order-1">
                <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Varför välja PetMemories?</h3>
                  
                  <div className="space-y-6">
                    {/* Vi erbjuder */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h4 className="text-xl font-bold text-green-800 mb-4">Vi erbjuder:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>5 minuters AI-generering</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>299kr premium print (20% REA)</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>6+ olika AI-konststilar</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Preview innan köp</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Svensk support & EU-datalagring</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Andra erbjuder */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="text-xl font-bold text-red-800 mb-4">Andra erbjuder:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>3-7 dagars väntetid</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>539-800kr för samma storlek</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>3-5 förutbestämda stilar</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Betala innan du ser resultatet</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Lång e-post-kommunikation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA i egen kolumn under de andra */}
            <div className="text-center">
              <Link href="/generera">
                <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-12 py-5 rounded-lg font-semibold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 mx-auto">
                  <Sparkles className="w-6 h-6" />
                  Testa 20% REA nu
                </button>
              </Link>
            </div>
          
          {/* Bonus info */}
          <div className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Svenskt företag med EU-datalagring</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700">Över 500 nöjda husdjursägare</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">Preview innan köp - noll risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Så enkelt fungerar det
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Från vanligt foto till konstposter på bara några minuter. Se exakt hur processen fungerar.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="aspect-square w-48 mx-auto rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                    <Image
                      src={step.example}
                      alt={step.title}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Gallery */}
      <section id="examples" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Riktiga resultat från våra kunder
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Inga fake reviews - bara äkta transformationer och glada kunder.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {customerStories.map((story, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                  <Image
                    src={story.image}
                    alt={`${story.pet} konstposter`}
                    width={300}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">&quot;{story.quote}&quot;</p>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{story.name}</div>
                    <div className="text-gray-500">{story.pet} • {story.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/generera">
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 mx-auto">
                Skapa din egen poster
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Style Gallery */}
      <section id="styles" className="px-4 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Välj din favoritstil
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Varje stil skapar en unik känsla. Alla exempel nedan är riktiga AI-genererade posters.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {artStyles.map((style, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="aspect-[3/4] bg-gray-100">
                  <Image
                    src={style.image}
                    alt={`${style.name} stil`}
                    width={250}
                    height={333}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{style.emoji}</span>
                    <h3 className="text-lg font-bold text-gray-900">{style.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{style.description}</p>
                  <p className="text-xs text-gray-500">Exempel: {style.example}</p>
                  <div className="mt-3 text-orange-600 font-semibold">Från 79kr</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-16">
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
                <div className="mb-4">
                  <div className="text-lg text-gray-400 line-through mb-1">Från 374kr</div>
                  <div className="text-3xl font-bold text-orange-600">Från 299kr</div>
                  <div className="text-sm text-red-500 font-semibold">🔥 20% LANSERINGS-REA</div>
                </div>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Premium Matt kvalitet</span>
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

      {/* FAQ Section */}
      <FAQ />

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-pink-500" />
              <h3 className="text-2xl font-bold">PetMemories</h3>
            </div>
            <p className="text-gray-400 mb-6">Förvandla kärlek till konst</p>
          </div>
          
          <div className="flex justify-center gap-6 text-sm text-gray-400 mb-4">
            <span>© 2025 PetMemories</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Integritetspolicy
            </Link>
            <span>•</span>
            <Link href="/villkor" className="hover:text-gray-300 transition-colors">
              Villkor
            </Link>
          </div>
          
          {/* Subtil företagsinfo */}
          <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
            <p>PetMemories (hobbyverksamhet) • Viktor Ekström • Borås, Sverige • info@petmemories.se</p>
          </div>
        </div>
      </footer>
    </div>
  );
}