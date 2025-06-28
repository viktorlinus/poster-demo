'use client';
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "Hur fungerar AI-genereringen?",
      answer: "Vi använder OpenAI:s avancerade bildbehandlings-AI för att förvandla ditt husdjursfoto till konstnärliga posters. Du får 2 olika alternativ att välja mellan i din valda stil (akvarell, blyerts, oljemålning, etc.)."
    },
    {
      question: "Vilken bildkvalitet ska mitt foto ha?",
      answer: "För bästa resultat, använd ett tydligt foto där ditt husdjur är huvudfokus. Bilden bör vara minst 512x512 pixlar. Vi accepterar JPEG, PNG och WebP-format."
    },
    {
      question: "Hur lång tid tar det att få min poster?",
      answer: "AI-genereringen tar 30-60 sekunder. Digital nedladdning är omedelbar efter betalning. Fysiska prints levereras inom 2-4 arbetsdagar via våra kvalitetssäkrade tryckpartners."
    },
    {
      question: "Vad är skillnaden mellan Digital och Print?",
      answer: "Digital (79kr): Högupplöst fil för hemutskrift eller digital användning. Print (från 299kr): Professionellt tryckt poster på premium matt-papper i vald storlek + inkluderar digital fil. Priset varierar beroende på storlek."
    },
    {
      question: "Kan jag lägga till text på min poster?",
      answer: "Ja! Efter AI-genereringen kan du använda vår texteditor för att lägga till namn, datum eller minnestext med professionella typsnitt. Detta är helt frivilligt."
    },
    {
      question: "Vad händer om jag inte gillar resultatet?",
      answer: "Du ser preview-bilder innan betalning, så du kan välja din favorit först. Om din mottagna poster är skadad eller defekt erbjuder vi naturligtvis ersättning eller återbetalning."
    },
    {
      question: "Varför AI istället för handgjorda porträtt?",
      answer: "AI ger dig samma konstnärliga kvalitet som traditionella porträtt, men på 5 minuter istället för 7 dagar och till mindre än halva priset. Du får dessutom välja mellan många olika stilar och kan se preview innan köp. Många kunder tycker våra AI-posters är lika vackra som handgjorda alternativ."
    },
    {
      question: "Vad är skillnaden mot andra svenska tjänster?",
      answer: "Andra svenska tjänster tar 3-7 dagar och kostar 539-800kr. Vi levererar samma kvalitet på 5 minuter för 299kr (eller 79kr digitalt). De erbjuder 3-5 förutbestämda stilar, vi erbjuder 6+ stilar med AI-precision som kan anpassas perfekt för ditt husdjur."
    },
    {
      question: "Är AI-kvaliteten lika bra som traditionella porträtt?",
      answer: "Ja! Våra kunder är ofta förvånade över kvaliteten. AI:n har tränats på tusentals professionella konstporträtt och kan fånga ditt husdjurs personlighet och kännetecken mycket väl. Plus att du får välja mellan 2 alternativ så du kan hitta den som passar bäst."
    },
    {
      question: "Hur många genereringar får jag per dag?",
      answer: "Du får 3 gratis AI-genereringar per dag för att testa tjänsten. Varje generering ger dig 2 alternativ att välja mellan. Detta gäller preview-funktionen innan köp."
    },
    {
      question: "Är mina bilder säkra och privata?",
      answer: "Ja, vi tar integritet på allvar. Dina foton används endast för att skapa din poster och raderas automatiskt efter 30 dagar. Vi delar aldrig dina bilder med tredje part."
    },
    {
      question: "Vilka betalningsmetoder accepterar ni?",
      answer: "Vi accepterar alla större kreditkort och debetkort via Stripe's säkra betalningssystem. Du kan även betala med digitala plånböcker som Apple Pay och Google Pay om du har dem kopplade."
    },
    {
      question: "Kan jag beställa flera kopior av samma design?",
      answer: "Ja! Kontakta oss efter ditt första köp så hjälper vi dig med ytterligare prints till rabatterat pris."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="px-4 py-16 bg-white/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vanliga frågor
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Har du frågor om vår AI-poster-tjänst? Här hittar du svar på de vanligaste frågorna.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Har du fler frågor?
          </p>
          <a
            href="mailto:info@petmemories.se"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Kontakta oss
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;