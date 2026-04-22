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
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-28 md:pb-16">
        {/* Top bar */}
        <div className="mb-12 flex items-center justify-between border border-gray-100 bg-white px-6 py-4 rounded-xl shadow-sm">
          <div className="text-xl font-bold text-[#111]">
            <span className="text-[#2D8A3E]">Care</span>Signal
          </div>

          <span className="text-sm font-semibold text-gray-700">
            Build with AI 2026
          </span>
        </div>

        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
          {/* Left content */}
          <div>
            <button
              onClick={onBack}
              className="mb-6 text-sm text-[#6B7280] hover:text-[#111] transition-colors"
            >
              ← Back
            </button>

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E] mb-4">
              Symptom check
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1A24] tracking-tight leading-[1.05] mb-4">
              Select your symptoms
            </h1>

            <p className="text-lg text-[#6B7280] leading-relaxed mb-10 max-w-xl">
              Choose the symptoms that best match how you feel right now.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SYMPTOMS.map((symptom) => {
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
          </div>

          {/* Right panel desktop only */}
          <div className="hidden md:block bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E] mb-4">
              Progress
            </p>

            <h2 className="text-2xl font-bold text-[#0B1A24] mb-3">
              Build your symptom profile
            </h2>

            <p className="text-sm text-[#6B7280] leading-6 mb-8">
              Your selected symptoms will be used to generate a clearer next-step assessment.
            </p>

            <div className="mb-8">
              <div className="text-sm text-[#6B7280] mb-3">Selected symptoms</div>

              {selected.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selected.map((symptom) => (
                    <span
                      key={symptom}
                      className="px-3 py-2 text-sm bg-[#F0FDF4] text-[#2D8A3E] border border-[#CFE9D8] rounded-lg"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-[#9CA3AF]">
                  No symptoms selected yet
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#E5E7EB]">
              <div className="text-sm text-[#6B7280]">
                {selected.length > 0
                  ? `${selected.length} selected`
                  : 'Select at least one'}
              </div>

              <button
                onClick={() => onNext(selected)}
                disabled={selected.length === 0}
                className="bg-[#0B1A24] text-white py-3 px-8 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#0B1A24]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white px-4 py-4 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-[#6B7280]">
            {selected.length > 0 ? `${selected.length} selected` : 'Select at least one'}
          </div>

          <button
            onClick={() => onNext(selected)}
            disabled={selected.length === 0}
            className="bg-[#0B1A24] text-white py-3 px-6 text-sm font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}