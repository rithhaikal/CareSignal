import { useState } from 'react';

interface ResultScreenProps {
  severity: 'safe' | 'clinic' | 'emergency';
  guidance?: any;
  isTranslating: boolean;
  onRestart: () => void;
  onFindCare: () => void;
  language: 'en' | 'bm';
  onToggleLanguage: () => void;
}

const RESULTS = {
  safe: {
    label: {
      en: 'SAFE TO MONITOR',
      bm: 'SELAYAKNYA DIPANTAU',
    },
    subLabel: {
      en: 'Low Risk • Confidence: High',
      bm: 'Risiko Rendah • Keyakinan Tinggi',
    },
    color: '#2D8A3E',
    action: {
      en: 'Monitor at home',
      bm: 'Pantau di rumah',
    },
    explanation: {
      en: 'Your selected symptoms do not currently show major warning signs, but they should still be monitored closely.',
      bm: 'Simptom yang dipilih pada masa ini tidak menunjukkan tanda amaran utama, tetapi masih perlu dipantau dengan teliti.',
    },
    timeline: {
      morning: {
        en: ['Drink water regularly', 'Rest and avoid heavy activity'],
        bm: ['Minum air secukupnya', 'Berehat dan elakkan aktiviti berat'],
      },
      afternoon: {
        en: ['Eat light meals if tolerated', 'Notice any symptom changes'],
        bm: ['Ambil makanan ringan jika sesuai', 'Perhatikan sebarang perubahan simptom'],
      },
      night: {
        en: ['Reassess symptoms before sleep', 'Seek care if symptoms worsen'],
        bm: ['Nilai semula simptom sebelum tidur', 'Dapatkan rawatan jika simptom bertambah teruk'],
      },
    },
    whenToAct: {
      en: [
        'Symptoms become significantly worse',
        'New severe symptoms appear',
        'You are unable to drink or eat properly'
      ],
      bm: [
        'Simptom menjadi semakin teruk',
        'Tanda simptom serius yang baru muncul',
        'Anda tidak mampu makan atau minum dengan baik'
      ],
    },
    waitRisk: {
      en: [
        { time: 'Now', level: 'Low concern', desc: 'Your symptoms can be monitored at home for now.' },
        { time: '+24 Hours', level: 'Reassess', desc: 'If symptoms remain the same, reassess your condition and continue monitoring closely.' },
        { time: '+48 Hours', level: 'Consider clinic visit', desc: 'If symptoms persist or worsen, a clinic visit may be more appropriate.' }
      ],
      bm: [
        { time: 'Sekarang', level: 'Risiko rendah', desc: 'Simptom anda boleh dipantau di rumah buat masa ini.' },
        { time: '+24 Jam', level: 'Nilai semula', desc: 'Jika simptom kekal sama, nilai semula keadaan anda dan teruskan pemantauan.' },
        { time: '+48 Jam', level: 'Pertimbangkan klinik', desc: 'Jika simptom berterusan atau bertambah teruk, lawatan ke klinik mungkin lebih sesuai.' }
      ]
    }
  },
  clinic: {
    label: {
      en: 'VISIT CLINIC',
      bm: 'PERGI KE KLINIK',
    },
    subLabel: {
      en: 'Moderate Risk • Confidence: High',
      bm: 'Risiko Sederhana • Keyakinan Tinggi',
    },
    color: '#E67700',
    action: {
      en: 'Visit a clinic within 24 hours',
      bm: 'Kunjungi klinik dalam masa 24 jam',
    },
    explanation: {
      en: 'Your symptoms suggest you should be assessed by a healthcare provider soon rather than continuing to monitor at home.',
      bm: 'Simptom anda menunjukkan bahawa anda perlu diperiksa oleh petugas kesihatan secepat mungkin dan tidak hanya dipantau di rumah.',
    },
    timeline: {
      morning: {
        en: ['Schedule a clinic visit', 'Prepare a short symptom summary'],
        bm: ['Atur lawatan ke klinik', 'Sediakan ringkasan simptom yang dialami'],
      },
      afternoon: {
        en: ['Attend the appointment if available', 'Keep monitoring symptom changes'],
        bm: ['Hadir temu janji jika tersedia', 'Teruskan memantau perubahan simptom'],
      },
      night: {
        en: ['Follow advice given by the clinic', 'Escalate if symptoms worsen quickly'],
        bm: ['Ikut nasihat yang diberi klinik', 'Dapatkan rawatan segera jika simptom cepat bertambah teruk'],
      },
    },
    whenToAct: {
      en: [
        'Breathing becomes difficult',
        'Severe chest pain develops',
        'Confusion or extreme weakness appears'
      ],
      bm: [
        'Pernafasan menjadi sukar',
        'Sakit dada yang teruk berlaku',
        'Kekeliruan atau kelemahan melampau berlaku'
      ],
    },
    waitRisk: {
      en: [
        { time: 'Now', level: 'Clinic advised', desc: 'A clinic visit is recommended based on your current symptom pattern.' },
        { time: '+24 Hours', level: 'Higher concern', desc: 'If symptoms remain the same or worsen, urgent medical review may be needed sooner.' },
        { time: '+48 Hours', level: 'Urgent escalation', desc: 'Delaying care further may increase the chance of complications.' }
      ],
      bm: [
        { time: 'Sekarang', level: 'Klinik disyorkan', desc: 'Lawatan ke klinik disyorkan berdasarkan corak simptom semasa anda.' },
        { time: '+24 Jam', level: 'Kebimbangan lebih tinggi', desc: 'Jika simptom kekal sama atau bertambah teruk, semakan perubatan segera mungkin diperlukan.' },
        { time: '+48 Jam', level: 'Perlu tindakan segera', desc: 'Menangguhkan rawatan lebih lama boleh meningkatkan risiko komplikasi.' }
      ]
    }
  },
  emergency: {
    label: {
      en: 'SEEK EMERGENCY CARE',
      bm: 'DAPATKAN RAWATAN KECEMASAN',
    },
    subLabel: {
      en: 'High Risk • Confidence: High',
      bm: 'Risiko Tinggi • Keyakinan Tinggi',
    },
    color: '#C92A2A',
    action: {
      en: 'Go to emergency care now',
      bm: 'Pergi ke rawatan kecemasan sekarang',
    },
    explanation: {
      en: 'Your selected symptoms include serious warning signs that should not be monitored at home.',
      bm: 'Simptom yang dipilih termasuk tanda amaran serius yang tidak sepatutnya dipantau di rumah.',
    },
    timeline: {
      morning: {
        en: ['Go to the emergency department immediately', 'Get help from someone nearby if needed'],
        bm: ['Pergi ke jabatan kecemasan dengan segera', 'Dapatkan bantuan orang berdekatan jika perlu'],
      },
      afternoon: {
        en: ['Do not delay treatment', 'Bring your medication list if possible'],
        bm: ['Jangan tangguhkan rawatan', 'Bawa senarai ubat jika boleh'],
      },
      night: {
        en: ['Do not drive yourself if unsafe', 'Escalate immediately if symptoms intensify'],
        bm: ['Jangan memandu sendiri jika tidak selamat', 'Dapatkan bantuan segera jika simptom semakin teruk'],
      },
    },
    whenToAct: {
      en: [
        'Loss of consciousness',
        'Severe difficulty breathing',
        'Uncontrolled bleeding'
      ],
      bm: [
        'Hilang kesedaran',
        'Kesukaran bernafas yang teruk',
        'Pendarahan yang tidak terkawal'
      ],
    },
    waitRisk: {
      en: [
        { time: 'Now', level: 'Immediate action', desc: 'Emergency evaluation is needed right away.' },
        { time: '+24 Hours', level: 'Severe risk', desc: 'Waiting may significantly worsen the situation and increase danger.' },
        { time: '+48 Hours', level: 'Critical risk', desc: 'Delaying care further may lead to life-threatening complications.' }
      ],
      bm: [
        { time: 'Sekarang', level: 'Tindakan segera', desc: 'Penilaian kecemasan diperlukan dengan segera.' },
        { time: '+24 Jam', level: 'Risiko serius', desc: 'Menunggu boleh memburukkan keadaan dan meningkatkan bahaya.' },
        { time: '+48 Jam', level: 'Risiko kritikal', desc: 'Menangguhkan rawatan lebih lama boleh membawa kepada komplikasi yang mengancam nyawa.' }
      ]
    }
  }
};

export function ResultScreen({
  severity,
  guidance,
  isTranslating,
  onRestart,
  onFindCare,
  language,
  onToggleLanguage
}: ResultScreenProps) {
  const result = RESULTS[severity];

  const uiText = {
    en: {
      assessmentResult: 'Assessment result',
      next24: 'Next 24 Hours',
      morning: 'Morning',
      afternoon: 'Afternoon',
      night: 'Night',
      warningSigns: 'Warning Signs',
      seekSooner: 'Seek care sooner if',
      ifThingsChange: 'If Things Change',
      checkAgain: 'Check Again',
      findClinic: 'Find Nearby Clinic',
      findHospital: 'Find Nearby Hospital',
      disclaimer: 'Not a medical diagnosis. Always consult healthcare professionals.',
    },
    bm: {
      assessmentResult: 'Keputusan penilaian',
      next24: '24 Jam Seterusnya',
      morning: 'Pagi',
      afternoon: 'Petang',
      night: 'Malam',
      warningSigns: 'Tanda Amaran',
      seekSooner: 'Dapatkan rawatan lebih awal jika',
      ifThingsChange: 'Jika Keadaan Berubah',
      checkAgain: 'Semak Semula',
      findClinic: 'Cari Klinik Berdekatan',
      findHospital: 'Cari Hospital Berdekatan',
      disclaimer: 'Ini bukan diagnosis perubatan. Sentiasa rujuk kepada profesional kesihatan.',
    }
  };

  const t = uiText[language];

  const [expandedSection, setExpandedSection] = useState<string | null>('timeline');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getLevelColor = (level: string) => {
    const lower = level.toLowerCase();
    if (
      lower.includes('critical') ||
      lower.includes('severe') ||
      lower.includes('immediate') ||
      lower.includes('kritikal') ||
      lower.includes('serius') ||
      lower.includes('segera')
    ) {
      return '#C92A2A';
    }
    if (
      lower.includes('clinic') ||
      lower.includes('higher') ||
      lower.includes('reassess') ||
      lower.includes('urgent') ||
      lower.includes('klinik') ||
      lower.includes('tinggi') ||
      lower.includes('nilai')
    ) {
      return '#E67700';
    }
    return '#2D8A3E';
  };

  if (isTranslating) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
        <div className="mb-12 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
          <div className="text-xl font-bold text-[#111]">
            <span className="text-[#2D8A3E]">Care</span>Signal
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-[#111] hover:border-[#111]"
            >
              {language === 'en' ? 'BM' : 'EN'}
            </button>

            <span className="text-sm font-semibold text-gray-700">
              Build with AI 2026
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-24">
          <div className="w-14 h-14 border-4 border-[#D1D5DB] border-t-[#0B1A24] rounded-full animate-spin mb-8"></div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
            {language === 'bm' ? 'Menukar bahasa' : 'Switching language'}
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B1A24] mb-4">
            {language === 'bm' ? 'Memuatkan panduan anda' : 'Loading your guidance'}
          </h2>

          <p className="max-w-xl text-lg leading-relaxed text-[#6B7280]">
            {language === 'bm'
              ? 'Sedang mendapatkan versi bahasa yang dipilih.'
              : 'Fetching the selected language version now.'}
          </p>
        </div>
      </div>
    </div>
  );
}

  const explanation = guidance?.explanation || result.explanation[language];
  const morningTimeline = guidance?.next24h?.morning || result.timeline.morning[language];
  const afternoonTimeline = guidance?.next24h?.afternoon || result.timeline.afternoon[language];
  const nightTimeline = guidance?.next24h?.night || result.timeline.night[language];
  const warningSigns = guidance?.warningSigns || result.whenToAct[language];

  const waitRisk = guidance?.ifYouWait?.length
    ? [
        {
          time: language === 'en' ? 'Now' : 'Sekarang',
          level: language === 'en' ? 'Current state' : 'Keadaan semasa',
          desc: guidance.ifYouWait[0]
        },
        {
          time: language === 'en' ? '+24 Hours' : '+24 Jam',
          level: language === 'en' ? 'If still not improving' : 'Jika masih tidak pulih',
          desc: guidance.ifYouWait[1]
        },
        {
          time: language === 'en' ? '+48 Hours' : '+48 Jam',
          level: language === 'en' ? 'If symptoms worsen' : 'Jika simptom bertambah teruk',
          desc: guidance.ifYouWait[2]
        }
      ]
    : result.waitRisk[language];

  const careButtonLabel =
    severity === 'emergency' ? t.findHospital : t.findClinic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
        <div className="mb-12 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
          <div className="text-xl font-bold text-[#111]">
            <span className="text-[#2D8A3E]">Care</span>Signal
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-[#111] hover:border-[#111]"
            >
              {language === 'en' ? 'BM' : 'EN'}
            </button>

            <span className="text-sm font-semibold text-gray-700">
              Build with AI 2026
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
              {t.assessmentResult}
            </p>

            <div
              className="rounded-xl border px-6 py-6 mb-5"
              style={{
                borderColor: result.color,
                backgroundColor:
                  severity === 'safe'
                    ? '#F0FDF4'
                    : severity === 'clinic'
                    ? '#FFF7ED'
                    : '#FEF2F2'
              }}
            >
              <h1
                className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-2"
                style={{ color: result.color }}
              >
                {result.label[language]}
              </h1>

              <p className="text-sm font-medium text-[#6B7280]">
                {result.subLabel[language]}
              </p>
            </div>

            <div className="mb-8">
              <div className="text-xl font-semibold text-[#111] mb-3">
                {result.action[language]}
              </div>
              <p className="max-w-3xl text-base md:text-lg text-[#4B5563] leading-relaxed">
                {explanation}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRestart}
                className="rounded-lg bg-[#0B1A24] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                {t.checkAgain}
              </button>

              <button
                onClick={onFindCare}
                className="rounded-lg border border-[#E5E7EB] bg-white px-8 py-3 text-sm font-semibold text-[#111] transition-colors hover:border-[#111]"
              >
                {careButtonLabel}
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('timeline')}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]"
              >
                <span className="text-lg font-semibold text-[#111]">{t.next24}</span>
                <span className="text-xl text-[#6B7280]">
                  {expandedSection === 'timeline' ? '−' : '+'}
                </span>
              </button>

              {expandedSection === 'timeline' && (
                <div className="px-6 pb-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <div className="mb-3 text-xs uppercase tracking-wider text-[#6B7280]">
                        {t.morning}
                      </div>
                      <ul className="space-y-2">
                        {morningTimeline.map((item: string, i: number) => (
                          <li key={i} className="border-l border-[#D1D5DB] pl-3 text-sm text-[#111]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="mb-3 text-xs uppercase tracking-wider text-[#6B7280]">
                        {t.afternoon}
                      </div>
                      <ul className="space-y-2">
                        {afternoonTimeline.map((item: string, i: number) => (
                          <li key={i} className="border-l border-[#D1D5DB] pl-3 text-sm text-[#111]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="mb-3 text-xs uppercase tracking-wider text-[#6B7280]">
                        {t.night}
                      </div>
                      <ul className="space-y-2">
                        {nightTimeline.map((item: string, i: number) => (
                          <li key={i} className="border-l border-[#D1D5DB] pl-3 text-sm text-[#111]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('warnings')}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]"
              >
                <span className="text-lg font-semibold text-[#111]">{t.warningSigns}</span>
                <span className="text-xl text-[#6B7280]">
                  {expandedSection === 'warnings' ? '−' : '+'}
                </span>
              </button>

              {expandedSection === 'warnings' && (
                <div className="px-6 pb-6">
                  <div className="mb-3 text-xs uppercase tracking-wider text-[#C92A2A]">
                    {t.seekSooner}
                  </div>
                  <ul className="space-y-2">
                    {warningSigns.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-[#111]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection('simulate')}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]"
              >
                <span className="text-lg font-semibold text-[#111]">{t.ifThingsChange}</span>
                <span className="text-xl text-[#6B7280]">
                  {expandedSection === 'simulate' ? '−' : '+'}
                </span>
              </button>

              {expandedSection === 'simulate' && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {waitRisk.map((item: any, i: number) => (
                      <div key={i} className="rounded-lg border border-[#E5E7EB] bg-[#FAFCFF] p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="text-sm font-semibold text-[#111]">
                            {item.time}
                          </div>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              color: getLevelColor(item.level),
                              backgroundColor: `${getLevelColor(item.level)}15`
                            }}
                          >
                            {item.level}
                          </span>
                        </div>
                        <div className="text-sm leading-6 text-[#6B7280]">
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 border-t border-[#E5E7EB] pt-6">
            <p className="text-center text-sm text-[#6B7280]">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}