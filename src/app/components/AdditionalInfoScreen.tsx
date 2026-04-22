import { useState } from 'react';

interface AdditionalInfoScreenProps {
  onCheck: (duration: string, ageGroup: string) => void;
  onBack: () => void;
  language: 'en' | 'bm';
  onToggleLanguage: () => void;
}

const DURATIONS = {
  en: ['Less than 1 day', '1–2 days', 'More than 2 days'],
  bm: ['Kurang dari 1 hari', '1–2 hari', 'Lebih dari 2 hari']
};

const AGE_GROUPS = {
  en: ['Child (under 18)', 'Adult (18-64)', 'Elderly (65+)'],
  bm: ['Kanak-kanak (bawah 18)', 'Dewasa (18-64)', 'Warga emas (65+)']
};

export function AdditionalInfoScreen({
  onCheck,
  onBack,
  language,
  onToggleLanguage
}: AdditionalInfoScreenProps) {
  const [duration, setDuration] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('');

  const text = {
    en: {
      back: 'Back',
      section: 'Additional details',
      title: 'A little more context',
      description:
        'Help us assess your situation more clearly by choosing symptom duration and age group.',
      duration: 'Duration',
      ageGroup: 'Age Group',
      beforeAssessment: 'Before assessment',
      finalStep: 'Final step before your result',
      panelDesc:
        'These details help us give more relevant guidance based on how long symptoms have lasted and the age-related risk level.',
      durationSelected: 'Duration selected',
      ageGroupSelected: 'Age group selected',
      notSelected: 'Not selected yet',
      getAssessment: 'Get Assessment',
      ready: 'Ready to assess',
      selectBoth: 'Select both options',
    },
    bm: {
      back: 'Kembali',
      section: 'Maklumat tambahan',
      title: 'Sedikit lagi maklumat',
      description:
        'Bantu kami menilai keadaan anda dengan lebih jelas dengan memilih tempoh simptom dan kumpulan umur.',
      duration: 'Tempoh',
      ageGroup: 'Kumpulan umur',
      beforeAssessment: 'Sebelum penilaian',
      finalStep: 'Langkah terakhir sebelum keputusan anda',
      panelDesc:
        'Maklumat ini membantu kami memberi panduan yang lebih relevan berdasarkan tempoh simptom dan tahap risiko mengikut umur.',
      durationSelected: 'Tempoh dipilih',
      ageGroupSelected: 'Kumpulan umur dipilih',
      notSelected: 'Belum dipilih',
      getAssessment: 'Dapatkan Penilaian',
      ready: 'Sedia untuk dinilai',
      selectBoth: 'Pilih kedua-dua pilihan',
    }
  };

  const t = text[language];
  const durations = DURATIONS[language];
  const ageGroups = AGE_GROUPS[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-28 md:pb-16">
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

        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 items-start">
          <div>
            <button
              onClick={onBack}
              className="mb-6 text-sm text-[#6B7280] transition-colors hover:text-[#111]"
            >
              ← {t.back}
            </button>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
              {t.section}
            </p>

            <h1 className="mb-4 text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight text-[#0B1A24]">
              {t.title}
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-[#6B7280]">
              {t.description}
            </p>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <div className="mb-4 text-xs uppercase tracking-wider text-[#6B7280]">
                  {t.duration}
                </div>
                <div className="space-y-3">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`w-full min-h-[58px] rounded-xl border px-4 text-sm transition-all text-left flex items-center ${
                        duration === d
                          ? 'bg-[#0B1A24] border-[#0B1A24] text-white'
                          : 'bg-white text-[#111] border-[#E5E7EB] hover:border-[#2D8A3E]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 text-xs uppercase tracking-wider text-[#6B7280]">
                  {t.ageGroup}
                </div>
                <div className="space-y-3">
                  {ageGroups.map((age) => (
                    <button
                      key={age}
                      onClick={() => setAgeGroup(age)}
                      className={`w-full min-h-[58px] rounded-xl border px-4 text-sm transition-all text-left flex items-center ${
                        ageGroup === age
                          ? 'bg-[#0B1A24] border-[#0B1A24] text-white'
                          : 'bg-white text-[#111] border-[#E5E7EB] hover:border-[#2D8A3E]'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
              {t.beforeAssessment}
            </p>

            <h2 className="mb-3 text-2xl font-bold text-[#0B1A24]">
              {t.finalStep}
            </h2>

            <p className="mb-8 text-sm leading-6 text-[#6B7280]">
              {t.panelDesc}
            </p>

            <div className="space-y-5 mb-8">
              <div className="rounded-lg border border-[#E5E7EB] bg-[#FAFCFF] px-4 py-4">
                <div className="mb-1 text-xs uppercase tracking-wider text-[#6B7280]">
                  {t.durationSelected}
                </div>
                <div className="text-sm font-medium text-[#111]">
                  {duration || t.notSelected}
                </div>
              </div>

              <div className="rounded-lg border border-[#E5E7EB] bg-[#FAFCFF] px-4 py-4">
                <div className="mb-1 text-xs uppercase tracking-wider text-[#6B7280]">
                  {t.ageGroupSelected}
                </div>
                <div className="text-sm font-medium text-[#111]">
                  {ageGroup || t.notSelected}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-[#E5E7EB] pt-6">
              <button
                onClick={() => onCheck(duration, ageGroup)}
                disabled={!duration || !ageGroup}
                className="rounded-lg bg-[#0B1A24] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#0B1A24]"
              >
                {t.getAssessment}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white px-4 py-4 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-[#6B7280]">
            {duration && ageGroup ? t.ready : t.selectBoth}
          </div>

          <button
            onClick={() => onCheck(duration, ageGroup)}
            disabled={!duration || !ageGroup}
            className="rounded-lg bg-[#0B1A24] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            {t.getAssessment}
          </button>
        </div>
      </div>
    </div>
  );
}