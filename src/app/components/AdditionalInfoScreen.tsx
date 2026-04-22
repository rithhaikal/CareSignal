import { useState } from 'react';

interface AdditionalInfoScreenProps {
  onCheck: (duration: string, ageGroup: string) => void;
  onBack: () => void;
}

const DURATIONS = [
  'Less than 1 day',
  '1–2 days',
  'More than 2 days'
];

const AGE_GROUPS = [
  'Child (under 18)',
  'Adult (18-64)',
  'Elderly (65+)'
];

export function AdditionalInfoScreen({ onCheck, onBack }: AdditionalInfoScreenProps) {
  const [duration, setDuration] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-sm text-[#6B7280] mb-6 hover:text-[#111] transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-4xl mb-2 text-[#111] tracking-tight">Additional information</h1>
          <p className="text-base text-[#6B7280]">Help us assess your situation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-8">
          {/* Duration Section */}
          <div>
            <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-4">DURATION</div>
            <div className="space-y-3">
              {DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`w-full h-14 px-4 text-sm border transition-all text-left flex items-center ${
                    duration === d
                      ? 'bg-[#111] border-[#111] text-white'
                      : 'bg-white text-[#111] border-[#E5E7EB] hover:border-[#111]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Section */}
          <div>
            <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-4">AGE GROUP</div>
            <div className="space-y-3">
              {AGE_GROUPS.map(age => (
                <button
                  key={age}
                  onClick={() => setAgeGroup(age)}
                  className={`w-full h-14 px-4 text-sm border transition-all text-left flex items-center ${
                    ageGroup === age
                      ? 'bg-[#111] border-[#111] text-white'
                      : 'bg-white text-[#111] border-[#E5E7EB] hover:border-[#111]'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Check Button */}
        <div className="pt-6 border-t border-[#E5E7EB] flex justify-end">
          <button
            onClick={() => onCheck(duration, ageGroup)}
            disabled={!duration || !ageGroup}
            className="bg-[#111] text-white py-3 px-8 text-sm hover:bg-[#2B7A78] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#111]"
          >
            Get assessment
          </button>
        </div>
      </div>
    </div>
  );
}
