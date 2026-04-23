/**
 * Root application component for CareSignal.
 * Manages screen navigation, symptom state, severity calculation,
 * and AI guidance generation across the full user flow.
 *
 * Flow: Landing → Symptoms → AdditionalInfo → Loading → Result
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SymptomScreen } from './components/SymptomScreen';
import { AdditionalInfoScreen } from './components/AdditionalInfoScreen';
import { ResultScreen } from './components/ResultScreen';
import { generateGuidance } from '../utils/gemini';
import type { Screen, Severity, Language, GuidanceResponse } from '../types';

export default function App() {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  const [screen, setScreen] = useState<Screen>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [severity, setSeverity] = useState<Severity>('safe');
  const [isTranslating, setIsTranslating] = useState(false);

  /** Cached AI guidance per language to avoid redundant API calls on toggle */
  const [guidanceByLang, setGuidanceByLang] = useState<{
    en: GuidanceResponse | null;
    bm: GuidanceResponse | null;
  }>({
    en: null,
    bm: null,
  });

  // -------------------------------------------------------------------------
  // Localized loading screen text
  // -------------------------------------------------------------------------
  const text = {
    en: {
      processing: 'Processing',
      analyzing: 'Analyzing your symptoms',
      preparing: 'Preparing your result and next-step guidance now.',
    },
    bm: {
      processing: 'Memproses',
      analyzing: 'Menganalisis simptom anda',
      preparing: 'Sedang menyediakan keputusan dan panduan langkah seterusnya.',
    },
  };

  const t = text[language];

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  /** Returns the recommended action text based on severity and language */
  const getActionText = (currentSeverity: Severity, currentLanguage: Language) => {
    if (currentSeverity === 'clinic') {
      return currentLanguage === 'bm'
        ? 'Kunjungi klinik dalam masa 24 jam'
        : 'Visit a clinic within 24 hours';
    }

    if (currentSeverity === 'emergency') {
      return currentLanguage === 'bm'
        ? 'Pergi ke rawatan kecemasan sekarang'
        : 'Go to emergency care now';
    }

    return currentLanguage === 'bm' ? 'Pantau di rumah' : 'Monitor at home';
  };

  /**
   * Determines risk severity based on symptom combination, duration, and age.
   * Critical symptoms (Chest Pain, Breathing Difficulty, Confusion) → emergency.
   * 3+ symptoms, prolonged duration, or elderly age group → clinic.
   * Otherwise → safe to monitor at home.
   */
  const calculateSeverity = (
    selectedSymptoms: string[],
    selectedDuration: string,
    selectedAgeGroup: string
  ): Severity => {
    const criticalSymptoms = ['Chest Pain', 'Breathing Difficulty', 'Confusion'];
    const hasCritical = selectedSymptoms.some((s) => criticalSymptoms.includes(s));

    if (hasCritical || (selectedSymptoms.length >= 5 && selectedDuration === 'More than 2 days')) {
      return 'emergency';
    }

    if (
      selectedSymptoms.length >= 3 ||
      selectedDuration === 'More than 2 days' ||
      selectedAgeGroup.includes('65+')
    ) {
      return 'clinic';
    }

    return 'safe';
  };

  // -------------------------------------------------------------------------
  // AI Guidance
  // -------------------------------------------------------------------------

  /** Generates and caches AI guidance for a specific language */
  const generateAndStoreGuidance = async (
    targetLanguage: Language,
    currentSeverity: Severity,
    currentSymptoms: string[],
    currentDuration: string,
    currentAgeGroup: string,
    currentOtherSymptom: string
  ) => {
    const action = getActionText(currentSeverity, targetLanguage);

    const geminiResult = await generateGuidance({
      selectedSymptoms: currentSymptoms,
      duration: currentDuration,
      ageGroup: currentAgeGroup,
      risk: currentSeverity,
      action,
      otherSymptom: currentOtherSymptom,
      language: targetLanguage,
    });

    setGuidanceByLang((prev) => ({
      ...prev,
      [targetLanguage]: geminiResult,
    }));
  };

  // -------------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------------

  /** Toggles language and fetches AI guidance for the new language if needed */
  const toggleLanguage = async () => {
    const newLanguage: Language = language === 'en' ? 'bm' : 'en';
    setLanguage(newLanguage);

    // Fetch guidance in the new language if on result screen and not yet cached
    if (
      screen === 'result' &&
      !guidanceByLang[newLanguage] &&
      symptoms.length > 0 &&
      duration &&
      ageGroup
    ) {
      setIsTranslating(true);

      await generateAndStoreGuidance(
        newLanguage,
        severity,
        symptoms,
        duration,
        ageGroup,
        otherSymptom
      );

      setIsTranslating(false);
    }
  };

  /** Navigates from landing to symptom selection */
  const handleCheckNow = () => {
    setScreen('symptoms');
  };

  /** Stores selected symptoms and advances to additional info */
  const handleSymptomNext = (selectedSymptoms: string[], other: string) => {
    setSymptoms(selectedSymptoms);
    setOtherSymptom(other);
    setScreen('info');
  };

  /** Runs severity calculation, fetches AI guidance, and shows result */
  const handleCheck = async (selectedDuration: string, selectedAgeGroup: string) => {
    setDuration(selectedDuration);
    setAgeGroup(selectedAgeGroup);

    const result = calculateSeverity(symptoms, selectedDuration, selectedAgeGroup);
    setSeverity(result);
    setScreen('loading');

    const geminiResult = await generateGuidance({
      selectedSymptoms: symptoms,
      duration: selectedDuration,
      ageGroup: selectedAgeGroup,
      risk: result,
      action: getActionText(result, language),
      otherSymptom,
      language,
    });

    setGuidanceByLang({
      en: language === 'en' ? geminiResult : null,
      bm: language === 'bm' ? geminiResult : null,
    });

    setScreen('result');
  };

  /** Returns to symptom selection screen */
  const handleBackToSymptoms = () => {
    setScreen('symptoms');
  };

  /** Resets all state and returns to landing page */
  const handleRestart = () => {
    setSymptoms([]);
    setOtherSymptom('');
    setDuration('');
    setAgeGroup('');
    setSeverity('safe');
    setIsTranslating(false);
    setGuidanceByLang({ en: null, bm: null });
    setScreen('landing');
  };

  /** Opens Google Maps to find nearby clinics or hospitals based on severity */
  const handleFindCare = () => {
    let query = language === 'bm' ? 'klinik berdekatan' : 'clinic near me';

    if (severity === 'emergency') {
      query = language === 'bm' ? 'hospital berdekatan' : 'hospital near me';
    } else if (severity === 'clinic') {
      query = language === 'bm' ? 'klinik berdekatan' : 'clinic near me';
    }

    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen w-full">
      {screen === 'landing' && (
        <LandingPage
          onCheckNow={handleCheckNow}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      )}

      {screen === 'symptoms' && (
        <SymptomScreen
          onNext={handleSymptomNext}
          onBack={handleRestart}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      )}

      {screen === 'info' && (
        <AdditionalInfoScreen
          onCheck={handleCheck}
          onBack={handleBackToSymptoms}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      )}

      {/* Loading screen — shown while AI guidance is being generated */}
      {screen === 'loading' && (
        <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
            <Header language={language} onToggleLanguage={toggleLanguage} className="mb-12" />

            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-24">
              <div className="w-14 h-14 border-4 border-[#D1D5DB] border-t-[#0B1A24] rounded-full animate-spin mb-8"></div>

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
                {t.processing}
              </p>

              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B1A24] mb-4">
                {t.analyzing}
              </h2>

              <p className="max-w-xl text-lg leading-relaxed text-[#6B7280]">
                {t.preparing}
              </p>
            </div>
          </div>
        </div>
      )}

      {screen === 'result' && (
        <ResultScreen
          severity={severity}
          guidance={guidanceByLang[language]}
          isTranslating={isTranslating}
          onRestart={handleRestart}
          onFindCare={handleFindCare}
          language={language}
          onToggleLanguage={toggleLanguage}
          symptoms={symptoms}
          duration={duration}
          ageGroup={ageGroup}
        />
      )}
    </div>
  );
}