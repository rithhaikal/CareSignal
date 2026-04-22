import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { SymptomScreen } from './components/SymptomScreen';
import { AdditionalInfoScreen } from './components/AdditionalInfoScreen';
import { ResultScreen } from './components/ResultScreen';
import { generateGuidance } from '../utils/gemini';

type Screen = 'landing' | 'symptoms' | 'info' | 'loading' | 'result';
type Severity = 'safe' | 'clinic' | 'emergency';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<Severity>('safe');
  const [guidance, setGuidance] = useState<any>(null);

  const calculateSeverity = (
    selectedSymptoms: string[],
    duration: string,
    ageGroup: string
  ): Severity => {
    const criticalSymptoms = ['Chest Pain', 'Breathing Difficulty', 'Confusion'];
    const hasCritical = selectedSymptoms.some((s) => criticalSymptoms.includes(s));

    if (hasCritical || (selectedSymptoms.length >= 5 && duration === 'More than 2 days')) {
      return 'emergency';
    }

    if (
      selectedSymptoms.length >= 3 ||
      duration === 'More than 2 days' ||
      ageGroup.includes('65+')
    ) {
      return 'clinic';
    }

    return 'safe';
  };

  const handleCheckNow = () => {
    setScreen('symptoms');
  };

  const handleSymptomNext = (selectedSymptoms: string[]) => {
    setSymptoms(selectedSymptoms);
    setScreen('info');
  };

  const handleCheck = async (duration: string, ageGroup: string) => {
    const result = calculateSeverity(symptoms, duration, ageGroup);
    setSeverity(result);
    setScreen('loading');

    let action = 'Monitor at home';
    if (result === 'clinic') action = 'Visit a clinic within 24 hours';
    if (result === 'emergency') action = 'Go to emergency care now';

    const geminiResult = await generateGuidance({
      selectedSymptoms: symptoms,
      duration,
      ageGroup,
      risk: result,
      action,
      otherSymptom: ''
    });

    setGuidance(geminiResult);
    setScreen('result');
  };

  const handleBackToSymptoms = () => {
    setScreen('symptoms');
  };

  const handleRestart = () => {
    setSymptoms([]);
    setSeverity('safe');
    setGuidance(null);
    setScreen('landing');
  };

  const handleFindCare = () => {
    let query = 'clinic near me';

    if (severity === 'emergency') {
      query = 'hospital near me';
    } else if (severity === 'clinic') {
      query = 'clinic near me';
    }

    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen w-full">
      {screen === 'landing' && (
        <LandingPage onCheckNow={handleCheckNow} />
      )}

      {screen === 'symptoms' && (
        <SymptomScreen
          onNext={handleSymptomNext}
          onBack={handleRestart}
        />
      )}

      {screen === 'info' && (
        <AdditionalInfoScreen
          onCheck={handleCheck}
          onBack={handleBackToSymptoms}
        />
      )}

      {screen === 'loading' && (
        <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
            <div className="mb-12 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
              <div className="text-xl font-bold text-[#111]">
                <span className="text-[#2D8A3E]">Care</span>Signal
              </div>

              <span className="text-sm font-semibold text-gray-700">
                Build with AI 2026
              </span>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-24">
              <div className="w-14 h-14 border-4 border-[#D1D5DB] border-t-[#0B1A24] rounded-full animate-spin mb-8"></div>

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
                Processing
              </p>

              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B1A24] mb-4">
                Analyzing your symptoms
              </h2>

              <p className="max-w-xl text-lg leading-relaxed text-[#6B7280]">
                Preparing your result and next-step guidance now.
              </p>
            </div>
          </div>
        </div>
      )}

      {screen === 'result' && (
        <ResultScreen
          severity={severity}
          guidance={guidance}
          onRestart={handleRestart}
          onFindCare={handleFindCare}
        />
      )}
    </div>
  );
}