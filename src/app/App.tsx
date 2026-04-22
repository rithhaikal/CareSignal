import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { SymptomScreen } from './components/SymptomScreen';
import { AdditionalInfoScreen } from './components/AdditionalInfoScreen';
import { ResultScreen } from './components/ResultScreen';
import { generateGuidance } from '../utils/gemini';

type Screen = 'landing' | 'symptoms' | 'info' | 'loading' | 'result';
type Severity = 'safe' | 'clinic' | 'emergency';
type Language = 'en' | 'bm';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [severity, setSeverity] = useState<Severity>('safe');
  const [isTranslating, setIsTranslating] = useState(false);
  const [guidanceByLang, setGuidanceByLang] = useState<{ en: any; bm: any }>({
    en: null,
    bm: null,
  });

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

  const toggleLanguage = async () => {
    const newLanguage: Language = language === 'en' ? 'bm' : 'en';
    setLanguage(newLanguage);

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

  const handleCheckNow = () => {
    setScreen('symptoms');
  };

  const handleSymptomNext = (selectedSymptoms: string[], other: string) => {
    setSymptoms(selectedSymptoms);
    setOtherSymptom(other);
    setScreen('info');
  };

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

  const handleBackToSymptoms = () => {
    setScreen('symptoms');
  };

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

      {screen === 'loading' && (
        <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
            <div className="mb-12 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
              <div className="text-xl font-bold text-[#111]">
                <span className="text-[#2D8A3E]">Care</span>Signal
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleLanguage}
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
        />
      )}
    </div>
  );
}