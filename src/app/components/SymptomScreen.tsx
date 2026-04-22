import { useState } from 'react';

interface SymptomScreenProps {
  onNext: (symptoms: string[]) => void;
  onBack: () => void;
}

const SYMPTOMS = [
  'Fever',
  'Cough',
  'Chest Pain',
  'Headache',
  'Breathing Difficulty',
  'Nausea',
  'Dizziness',
  'Fatigue',
  'Abdominal Pain',
  'Confusion'
];

export function SymptomScreen({ onNext, onBack }: SymptomScreenProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelected(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-sm text-[#6B7280] mb-6 hover:text-[#111] transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-4xl mb-2 text-[#111] tracking-tight">Select your symptoms</h1>
          <p className="text-base text-[#6B7280]">Choose all that apply</p>
        </div>

        {/* Symptom Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {SYMPTOMS.map(symptom => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`h-16 px-3 text-sm border transition-all flex items-center justify-center ${
                selected.includes(symptom)
                  ? 'bg-[#111] border-[#111] text-white'
                  : 'bg-white text-[#111] border-[#E5E7EB] hover:border-[#111]'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
          {selected.length > 0 ? (
            <div className="text-sm text-[#6B7280]">
              {selected.length} selected
            </div>
          ) : (
            <div className="text-sm text-[#6B7280]">
              Select at least one
            </div>
          )}

          <button
            onClick={() => onNext(selected)}
            disabled={selected.length === 0}
            className="bg-[#111] text-white py-3 px-8 text-sm hover:bg-[#2B7A78] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#111]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
