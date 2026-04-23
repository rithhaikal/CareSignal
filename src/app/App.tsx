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


  /**
   * Determines risk severity based on symptom combination, duration, age,
   * and free-text custom symptom input.
   *
   * Critical symptoms (Chest Pain, Breathing Difficulty, Confusion) → emergency.
   * Severe keywords in otherSymptom (bleeding, unconscious, seizure, etc.) → emergency.
   * Concerning keywords in otherSymptom (blood, swelling, vomiting blood, etc.) → clinic.
   * 3+ symptoms, prolonged duration, or elderly age group → clinic.
   * Otherwise → safe to monitor at home.
   */
  const calculateSeverity = (
    selectedSymptoms: string[],
    selectedDuration: string,
    selectedAgeGroup: string,
    customSymptom: string = ''
  ): Severity => {
    const criticalSymptoms = ['Chest Pain', 'Breathing Difficulty', 'Confusion'];
    const hasCritical = selectedSymptoms.some((s) => criticalSymptoms.includes(s));

    // Check free-text otherSymptom for emergency-level keywords
    const lowerOther = customSymptom.toLowerCase().trim();
    const emergencyKeywords = [
      'bleeding', 'unconscious', 'seizure', 'not breathing',
      'choking', 'paralysis', 'stroke', 'heart attack',
      'severe pain', 'unresponsive', 'collapsed', 'coughing blood',
      'vomiting blood', 'blood in stool', 'suicidal', 'overdose',
      'severe bleeding', 'heavy bleeding', 'pendarahan teruk',
      'tidak sedar', 'sawan', 'lumpuh', 'sesak nafas teruk',
      'sakit dada teruk', 'pengsan',
    ];
    const hasEmergencyOther = lowerOther.length > 0 &&
      emergencyKeywords.some((kw) => lowerOther.includes(kw));

    // Check free-text for clinic-level keywords
    const clinicKeywords = [
      'blood', 'swelling', 'rash', 'high fever', 'severe',
      'infection', 'pus', 'fracture', 'broken', 'sprain',
      'persistent', 'worsening', 'recurring',
      'darah', 'bengkak', 'ruam', 'demam tinggi', 'teruk',
      'jangkitan', 'nanah', 'patah', 'retak',
    ];
    const hasClinicOther = lowerOther.length > 0 &&
      clinicKeywords.some((kw) => lowerOther.includes(kw));

    const totalSymptomCount = selectedSymptoms.length + (lowerOther.length > 0 ? 1 : 0);

    const isLongDuration = selectedDuration === 'More than 2 days' || selectedDuration === 'Lebih dari 2 hari';

    if (hasCritical || hasEmergencyOther || (totalSymptomCount >= 5 && isLongDuration)) {
      return 'emergency';
    }

    if (
      hasClinicOther ||
      totalSymptomCount >= 3 ||
      isLongDuration ||
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
    currentSymptoms: string[],
    currentDuration: string,
    currentAgeGroup: string,
    currentOtherSymptom: string
  ) => {
    const geminiResult = await generateGuidance({
      selectedSymptoms: currentSymptoms,
      duration: currentDuration,
      ageGroup: currentAgeGroup,
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
      (symptoms.length > 0 || otherSymptom.trim()) &&
      duration &&
      ageGroup
    ) {
      setIsTranslating(true);

      await generateAndStoreGuidance(
        newLanguage,
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

  /** Fetches AI-driven assessment, falls back to local severity calculation */
  const handleCheck = async (selectedDuration: string, selectedAgeGroup: string) => {
    setDuration(selectedDuration);
    setAgeGroup(selectedAgeGroup);

    // Calculate local severity as a fallback
    const fallbackSeverity = calculateSeverity(symptoms, selectedDuration, selectedAgeGroup, otherSymptom);
    setSeverity(fallbackSeverity);
    setScreen('loading');

    const geminiResult = await generateGuidance({
      selectedSymptoms: symptoms,
      duration: selectedDuration,
      ageGroup: selectedAgeGroup,
      otherSymptom,
      language,
    });

    // Use AI-determined severity if available, otherwise keep local fallback
    if (geminiResult.severity && ['safe', 'clinic', 'emergency'].includes(geminiResult.severity)) {
      setSeverity(geminiResult.severity);
    }

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
          onRestart={handleRestart}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      )}

      {/* Loading screen — shown while AI guidance is being generated */}
      {screen === 'loading' && (
        <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
            <Header language={language} onToggleLanguage={toggleLanguage} onLogoClick={handleRestart} className="mb-12" />

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