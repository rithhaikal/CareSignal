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

  const calculateSeverity = (selectedSymptoms: string[], duration: string, ageGroup: string): Severity => {
    const criticalSymptoms = ['Chest Pain', 'Breathing Difficulty', 'Confusion'];
    const hasCritical = selectedSymptoms.some(s => criticalSymptoms.includes(s));

    if (hasCritical || (selectedSymptoms.length >= 5 && duration === 'More than 2 days')) {
      return 'emergency';
    }

    if (selectedSymptoms.length >= 3 || duration === 'More than 2 days' || ageGroup.includes('65+')) {
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
    if (result === 'clinic') action = 'Schedule clinic appointment within 24 hours';
    if (result === 'emergency') action = 'Go to emergency department now';

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
    setScreen('landing');
  };

  return (
    <div className="min-h-screen w-full bg-white">
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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#111] rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl text-[#111] tracking-tight mb-2">Analyzing symptoms</h2>
          <p className="text-[#6B7280]">Our AI is preparing your personalized guidance...</p>
        </div>
      )}
      {screen === 'result' && (
        <ResultScreen
          severity={severity}
          guidance={guidance}
          onSimulate={() => {}}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}