/**
 * Landing page — the first screen users see.
 * Introduces CareSignal with a hero section and a 3-step overview.
 */

import { Header } from './Header';
import type { Language } from '../../types';

interface LandingPageProps {
  onCheckNow: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export function LandingPage({ onCheckNow, language, onToggleLanguage }: LandingPageProps) {
  const text = {
    en: {
      title: 'Not sure if you should go to the hospital?',
      description:
        'Get clear guidance in seconds based on your symptoms. No guessing. No panic. Just the next step.',
      cta: 'Check Symptoms',
      sectionTitle: 'How CareSignal helps',
      sectionDesc:
        'Built to support safer next-step decisions by helping users understand symptom severity, warning signs, and what to monitor over the next 24 hours.',
      card1Title: 'Describe your symptoms',
      card1Desc:
        'Select what you are feeling so the system can assess your current situation more clearly.',
      card2Title: 'Get risk-based guidance',
      card2Desc:
        'Understand whether it is safer to monitor at home, visit a clinic, or seek urgent care.',
      card3Title: 'Know what to watch next',
      card3Desc:
        'Review the next 24 hours plan, warning signs, and when to seek care sooner if things change.',
    },
    bm: {
      title: 'Tak pasti sama ada anda perlu pergi ke hospital?',
      description:
        'Dapatkan panduan yang jelas dalam beberapa saat berdasarkan simptom anda. Tiada teka-teki. Tiada panik. Hanya langkah seterusnya.',
      cta: 'Semak Simptom',
      sectionTitle: 'Bagaimana CareSignal membantu',
      sectionDesc:
        'Direka untuk membantu keputusan langkah seterusnya dengan lebih selamat melalui pemahaman tahap simptom, tanda amaran, dan apa yang perlu dipantau dalam 24 jam seterusnya.',
      card1Title: 'Terangkan simptom anda',
      card1Desc:
        'Pilih apa yang anda rasa supaya sistem boleh menilai keadaan semasa anda dengan lebih jelas.',
      card2Title: 'Dapatkan panduan berasaskan risiko',
      card2Desc:
        'Fahami sama ada lebih selamat untuk pantau di rumah, pergi ke klinik, atau dapatkan rawatan segera.',
      card3Title: 'Tahu apa yang perlu diperhatikan',
      card3Desc:
        'Semak pelan 24 jam seterusnya, tanda amaran, dan bila perlu mendapatkan rawatan lebih awal jika keadaan berubah.',
    }
  };

  const t = text[language];

  return (
    <div className="relative bg-gradient-to-br from-[#EAF7EF] via-white to-white overflow-hidden font-sans">
      {/* Header */}
      <div className="pt-6 px-6 max-w-7xl mx-auto relative z-10">
        <Header language={language} onToggleLanguage={onToggleLanguage} />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-40 z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-[64px] font-extrabold text-[#0B1A24] tracking-tight leading-[1.05] mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-10 font-medium">
              {t.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={onCheckNow}
                className="w-full sm:w-auto bg-[#0B1A24] text-white font-semibold py-4 px-8 rounded hover:bg-gray-800 transition-colors"
              >
                {t.cta}
              </button>
            </div>
          </div>
          <div className="relative flex justify-end">
            <img
              src="/hero.webp"
              alt="CareSignal symptom guidance illustration"
              className="w-full max-w-xl scale-100 drop-shadow-2xl object-contain mix-blend-darken"
            />
          </div>
        </div>
      </div>

      {/* 3-step overview */}
      <div className="bg-white border-t border-[#E5E7EB] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1A24] tracking-tight mb-6">
              {t.sectionTitle}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {t.sectionDesc}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: 1, title: t.card1Title, desc: t.card1Desc },
              { num: 2, title: t.card2Title, desc: t.card2Desc },
              { num: 3, title: t.card3Title, desc: t.card3Desc },
            ].map((card) => (
              <div key={card.num} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#F0FDF4] text-[#2D8A3E] rounded-full flex items-center justify-center text-xl font-bold mb-6 border border-[#bbf7d0]">
                  {card.num}
                </div>
                <h3 className="text-xl font-bold text-[#0B1A24] mb-3">{card.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}