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
    <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-28 md:pb-16">
        {/* Top bar */}
        <div className="mb-12 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
          <div className="text-xl font-bold text-[#111]">
            <span className="text-[#2D8A3E]">Care</span>Signal
          </div>

          <span className="text-sm font-semibold text-gray-700">
            Build with AI 2026
          </span>
        </div>

        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-12 items-start">
          {/* Left content */}
          <div>
            <button
              onClick={onBack}
              className="mb-6 text-sm text-[#6B7280] transition-colors hover:text-[#111]"
            >
              ← Back
            </button>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
              Additional details
            </p>

            <h1 className="mb-4 text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight text-[#0B1A24]">
              A little more context
            </h1>

            <p className="mb-10 max-w-xl text-lg leading-relaxed text-[#6B7280]">
              Help us assess your situation more clearly by choosing symptom duration and age group.
            </p>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Duration Section */}
              <div>
                <div className="mb-4 text-xs uppercase tracking-wider text-[#6B7280]">
                  Duration
                </div>
                <div className="space-y-3">
                  {DURATIONS.map((d) => (
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

              {/* Age Group Section */}
              <div>
                <div className="mb-4 text-xs uppercase tracking-wider text-[#6B7280]">
                  Age Group
                </div>
                <div className="space-y-3">
                  {AGE_GROUPS.map((age) => (
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

          {/* Right panel desktop only */}
          <div className="hidden md:block rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
              Before assessment
            </p>

            <h2 className="mb-3 text-2xl font-bold text-[#0B1A24]">
              Final step before your result
            </h2>

            <p className="mb-8 text-sm leading-6 text-[#6B7280]">
              These details help us give more relevant guidance based on how long symptoms have lasted and the age-related risk level.
            </p>

            <div className="space-y-5 mb-8">
              <div className="rounded-lg border border-[#E5E7EB] bg-[#FAFCFF] px-4 py-4">
                <div className="mb-1 text-xs uppercase tracking-wider text-[#6B7280]">
                  Duration selected
                </div>
                <div className="text-sm font-medium text-[#111]">
                  {duration || 'Not selected yet'}
                </div>
              </div>

              <div className="rounded-lg border border-[#E5E7EB] bg-[#FAFCFF] px-4 py-4">
                <div className="mb-1 text-xs uppercase tracking-wider text-[#6B7280]">
                  Age group selected
                </div>
                <div className="text-sm font-medium text-[#111]">
                  {ageGroup || 'Not selected yet'}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-[#E5E7EB] pt-6">
              <button
                onClick={() => onCheck(duration, ageGroup)}
                disabled={!duration || !ageGroup}
                className="rounded-lg bg-[#0B1A24] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#0B1A24]"
              >
                Get Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white px-4 py-4 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-[#6B7280]">
            {duration && ageGroup ? 'Ready to assess' : 'Select both options'}
          </div>

          <button
            onClick={() => onCheck(duration, ageGroup)}
            disabled={!duration || !ageGroup}
            className="rounded-lg bg-[#0B1A24] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Get Assessment
          </button>
        </div>
      </div>
    </div>
  );
}