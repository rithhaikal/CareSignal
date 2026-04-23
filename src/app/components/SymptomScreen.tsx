/**
 * Symptom selection screen — step 1 of the assessment flow.
 * Users pick from predefined symptoms and optionally add a custom one.
 * Includes a responsive sidebar showing selected symptoms and a
 * sticky mobile CTA bar.
 */

import { useState } from 'react';
import { Header } from './Header';
import type { Language } from '../../types';

interface SymptomScreenProps {
  /** Callback with selected symptoms and optional custom symptom */
  onNext: (symptoms: string[], otherSymptom: string) => void;
  /** Callback to return to landing page */
  onBack: () => void;
  /** Current active language */
  language: Language;
  /** Callback to switch between EN and BM */
  onToggleLanguage: () => void;
}

/** Predefined symptom options in both languages */
const SYMPTOMS = {
  en: [
    'Fever', 'Cough', 'Chest Pain', 'Headache', 'Breathing Difficulty',
    'Nausea', 'Dizziness', 'Fatigue', 'Abdominal Pain', 'Confusion',
  ],
  bm: [
    'Demam', 'Batuk', 'Sakit Dada', 'Sakit Kepala', 'Sesak Nafas',
    'Loya', 'Pening', 'Keletihan', 'Sakit Perut', 'Kekeliruan',
  ],
};

export function SymptomScreen({ onNext, onBack, language, onToggleLanguage }: SymptomScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState('');

  const text = {
    en: {
      back: 'Back',
      section: 'Symptom check',
      title: 'Select your symptoms',
      description: 'Choose the symptoms that best match how you feel right now.',
      otherLabel: 'Other symptom (optional)',
      otherPlaceholder: 'Add another symptom',
      progress: 'Progress',
      progressTitle: 'Build your symptom profile',
      progressDesc: 'Your selected symptoms will be used to generate a clearer next-step assessment.',
      selectedSymptoms: 'Selected symptoms',
      noSymptoms: 'No symptoms selected yet',
      continue: 'Continue',
      selectOne: 'Select at least one',
      selectedCount: (count: number) => `${count} selected`,
    },
    bm: {
      back: 'Kembali',
      section: 'Semakan simptom',
      title: 'Pilih simptom anda',
      description: 'Pilih simptom yang paling sesuai dengan keadaan anda sekarang.',
      otherLabel: 'Simptom lain (pilihan)',
      otherPlaceholder: 'Tambah simptom lain',
      progress: 'Kemajuan',
      progressTitle: 'Bina profil simptom anda',
      progressDesc: 'Simptom yang anda pilih akan digunakan untuk menghasilkan penilaian langkah seterusnya yang lebih jelas.',
      selectedSymptoms: 'Simptom dipilih',
      noSymptoms: 'Tiada simptom dipilih lagi',
      continue: 'Teruskan',
      selectOne: 'Pilih sekurang-kurangnya satu',
      selectedCount: (count: number) => `${count} dipilih`,
    },
  };

  const t = text[language];
  const symptoms = SYMPTOMS[language];

  /** Toggles a symptom in/out of the selected list */
  const toggleSymptom = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const totalSelected = selected.length + (otherSymptom.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-28 md:pb-16">
        <Header language={language} onToggleLanguage={onToggleLanguage} onLogoClick={onBack} className="mb-12" />

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          {/* Left column — symptom selection */}
          <div>
            <button
              onClick={onBack}
              className="mb-6 text-sm text-[#6B7280] hover:text-[#111] transition-colors"
            >
              ← {t.back}
            </button>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E] mb-4">
              {t.section}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1A24] tracking-tight leading-[1.05] mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-10 max-w-xl">
              {t.description}
            </p>

            {/* Symptom grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {symptoms.map((symptom) => {
                const isSelected = selected.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`min-h-[72px] px-4 py-4 text-sm md:text-base border rounded-xl transition-all text-left flex items-center ${
                      isSelected
                        ? 'bg-[#0B1A24] border-[#0B1A24] text-white'
                        : 'bg-white text-[#111] border-[#E5E7EB] hover:border-[#2D8A3E]'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>

            {/* Custom symptom input */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6B7280] mb-2">
                {t.otherLabel}
              </label>
              <input
                type="text"
                placeholder={t.otherPlaceholder}
                value={otherSymptom}
                onChange={(e) => setOtherSymptom(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#111] bg-white focus:outline-none focus:border-[#2D8A3E]"
              />
            </div>
          </div>

          {/* Right column — progress sidebar (desktop only) */}
          <div className="hidden md:block bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E] mb-4">
              {t.progress}
            </p>
            <h2 className="text-2xl font-bold text-[#0B1A24] mb-3">{t.progressTitle}</h2>
            <p className="text-sm text-[#6B7280] leading-6 mb-8">{t.progressDesc}</p>

            <div className="mb-8">
              <div className="text-sm text-[#6B7280] mb-3">{t.selectedSymptoms}</div>
              {totalSelected > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selected.map((symptom) => (
                    <span key={symptom} className="px-3 py-2 text-sm bg-[#F0FDF4] text-[#2D8A3E] border border-[#CFE9D8] rounded-lg">
                      {symptom}
                    </span>
                  ))}
                  {otherSymptom.trim() && (
                    <span className="px-3 py-2 text-sm bg-[#F0FDF4] text-[#2D8A3E] border border-[#CFE9D8] rounded-lg">
                      {otherSymptom.trim()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-sm text-[#9CA3AF]">{t.noSymptoms}</div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
              <div className="text-sm text-[#6B7280]">
                {totalSelected > 0 ? t.selectedCount(totalSelected) : t.selectOne}
              </div>
              <button
                onClick={() => onNext(selected, otherSymptom.trim())}
                disabled={totalSelected === 0}
                className="bg-[#0B1A24] text-white py-3 px-8 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#0B1A24]"
              >
                {t.continue}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white px-4 py-4 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-[#6B7280]">
            {totalSelected > 0 ? t.selectedCount(totalSelected) : t.selectOne}
          </div>
          <button
            onClick={() => onNext(selected, otherSymptom.trim())}
            disabled={totalSelected === 0}
            className="bg-[#0B1A24] text-white py-3 px-6 text-sm font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t.continue}
          </button>
        </div>
      </div>
    </div>
  );
}