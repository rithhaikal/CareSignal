import { useState } from 'react';

interface ResultScreenProps {
  severity: 'safe' | 'clinic' | 'emergency';
  guidance?: any;
  onRestart: () => void;
  onFindCare: () => void;
}

const RESULTS = {
  safe: {
    label: 'SAFE TO MONITOR',
    subLabel: 'Low Risk • Confidence: High',
    color: '#2D8A3E',
    action: 'Monitor at home',
    explanation:
      'Your selected symptoms do not currently show major warning signs, but they should still be monitored closely.',
    timeline: {
      morning: ['Drink water regularly', 'Rest and avoid heavy activity'],
      afternoon: ['Eat light meals if tolerated', 'Notice any symptom changes'],
      night: ['Reassess symptoms before sleep', 'Seek care if symptoms worsen']
    },
    whenToAct: [
      'Symptoms become significantly worse',
      'New severe symptoms appear',
      'You are unable to drink or eat properly'
    ],
    waitRisk: [
      { time: 'Now', level: 'Low concern', desc: 'Your symptoms can be monitored at home for now.' },
      { time: '+24 Hours', level: 'Reassess', desc: 'If symptoms remain the same, reassess your condition and continue monitoring closely.' },
      { time: '+48 Hours', level: 'Consider clinic visit', desc: 'If symptoms persist or worsen, a clinic visit may be more appropriate.' }
    ]
  },
  clinic: {
    label: 'VISIT CLINIC',
    subLabel: 'Moderate Risk • Confidence: High',
    color: '#E67700',
    action: 'Visit a clinic within 24 hours',
    explanation:
      'Your symptoms suggest you should be assessed by a healthcare provider soon rather than continuing to monitor at home.',
    timeline: {
      morning: ['Schedule a clinic visit', 'Prepare a short symptom summary'],
      afternoon: ['Attend the appointment if available', 'Keep monitoring symptom changes'],
      night: ['Follow advice given by the clinic', 'Escalate if symptoms worsen quickly']
    },
    whenToAct: [
      'Breathing becomes difficult',
      'Severe chest pain develops',
      'Confusion or extreme weakness appears'
    ],
    waitRisk: [
      { time: 'Now', level: 'Clinic advised', desc: 'A clinic visit is recommended based on your current symptom pattern.' },
      { time: '+24 Hours', level: 'Higher concern', desc: 'If symptoms remain the same or worsen, urgent medical review may be needed sooner.' },
      { time: '+48 Hours', level: 'Urgent escalation', desc: 'Delaying care further may increase the chance of complications.' }
    ]
  },
  emergency: {
    label: 'SEEK EMERGENCY CARE',
    subLabel: 'High Risk • Confidence: High',
    color: '#C92A2A',
    action: 'Go to emergency care now',
    explanation:
      'Your selected symptoms include serious warning signs that should not be monitored at home.',
    timeline: {
      morning: ['Go to the emergency department immediately', 'Get help from someone nearby if needed'],
      afternoon: ['Do not delay treatment', 'Bring your medication list if possible'],
      night: ['Do not drive yourself if unsafe', 'Escalate immediately if symptoms intensify']
    },
    whenToAct: [
      'Loss of consciousness',
      'Severe difficulty breathing',
      'Uncontrolled bleeding'
    ],
    waitRisk: [
      { time: 'Now', level: 'Immediate action', desc: 'Emergency evaluation is needed right away.' },
      { time: '+24 Hours', level: 'Severe risk', desc: 'Waiting may significantly worsen the situation and increase danger.' },
      { time: '+48 Hours', level: 'Critical risk', desc: 'Delaying care further may lead to life-threatening complications.' }
    ]
  }
};

export function ResultScreen({ severity, guidance, onRestart, onFindCare }: ResultScreenProps) {
  const result = RESULTS[severity];

  const explanation = guidance?.explanation || result.explanation;
  const morningTimeline = guidance?.next24h?.morning || result.timeline.morning;
  const afternoonTimeline = guidance?.next24h?.afternoon || result.timeline.afternoon;
  const nightTimeline = guidance?.next24h?.night || result.timeline.night;
  const warningSigns = guidance?.warningSigns || result.whenToAct;

  const waitRisk = guidance?.ifYouWait?.length
    ? [
        { time: 'Now', level: 'Current state', desc: guidance.ifYouWait[0] },
        { time: '+24 Hours', level: 'If still not improving', desc: guidance.ifYouWait[1] },
        { time: '+48 Hours', level: 'If symptoms worsen', desc: guidance.ifYouWait[2] }
      ]
    : result.waitRisk;

  const [expandedSection, setExpandedSection] = useState<string | null>('timeline');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getLevelColor = (level: string) => {
    const lower = level.toLowerCase();
    if (lower.includes('critical') || lower.includes('severe') || lower.includes('immediate')) {
      return '#C92A2A';
    }
    if (lower.includes('clinic') || lower.includes('higher') || lower.includes('reassess') || lower.includes('urgent')) {
      return '#E67700';
    }
    return '#2D8A3E';
  };

  const careButtonLabel =
    severity === 'emergency' ? 'Find Nearby Hospital' : 'Find Nearby Clinic';

  return (
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

        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
              Assessment result
            </p>

            <div
              className="rounded-xl border px-6 py-6 mb-5"
              style={{
                borderColor: result.color,
                backgroundColor:
                  severity === 'safe'
                    ? '#F0FDF4'
                    : severity === 'clinic'
                    ? '#FFF7ED'
                    : '#FEF2F2'
              }}
            >
              <h1
                className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-2"
                style={{ color: result.color }}
              >
                {result.label}
              </h1>

              <p className="text-sm font-medium text-[#6B7280]">
                {result.subLabel}
              </p>
            </div>

            <div className="mb-8">
              <div className="text-xl font-semibold text-[#111] mb-3">
                {result.action}
              </div>
              <p className="max-w-3xl text-base md:text-lg text-[#4B5563] leading-relaxed">
                {explanation}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRestart}
                className="rounded-lg bg-[#0B1A24] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Check Again
              </button>

              <button
                onClick={onFindCare}
                className="rounded-lg border border-[#E5E7EB] bg-white px-8 py-3 text-sm font-semibold text-[#111] transition-colors hover:border-[#111]"
              >
                {careButtonLabel}
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('timeline')}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]"
              >
                <span className="text-lg font-semibold text-[#111]">Next 24 Hours</span>
                <span className="text-xl text-[#6B7280]">
                  {expandedSection === 'timeline' ? '−' : '+'}
                </span>
              </button>

              {expandedSection === 'timeline' && (
                <div className="px-6 pb-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <div className="mb-3 text-xs uppercase tracking-wider text-[#6B7280]">
                        Morning
                      </div>
                      <ul className="space-y-2">
                        {morningTimeline.map((item: string, i: number) => (
                          <li key={i} className="border-l border-[#D1D5DB] pl-3 text-sm text-[#111]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="mb-3 text-xs uppercase tracking-wider text-[#6B7280]">
                        Afternoon
                      </div>
                      <ul className="space-y-2">
                        {afternoonTimeline.map((item: string, i: number) => (
                          <li key={i} className="border-l border-[#D1D5DB] pl-3 text-sm text-[#111]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="mb-3 text-xs uppercase tracking-wider text-[#6B7280]">
                        Night
                      </div>
                      <ul className="space-y-2">
                        {nightTimeline.map((item: string, i: number) => (
                          <li key={i} className="border-l border-[#D1D5DB] pl-3 text-sm text-[#111]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('warnings')}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]"
              >
                <span className="text-lg font-semibold text-[#111]">Warning Signs</span>
                <span className="text-xl text-[#6B7280]">
                  {expandedSection === 'warnings' ? '−' : '+'}
                </span>
              </button>

              {expandedSection === 'warnings' && (
                <div className="px-6 pb-6">
                  <div className="mb-3 text-xs uppercase tracking-wider text-[#C92A2A]">
                    Seek care sooner if
                  </div>
                  <ul className="space-y-2">
                    {warningSigns.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-[#111]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection('simulate')}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]"
              >
                <span className="text-lg font-semibold text-[#111]">If Things Change</span>
                <span className="text-xl text-[#6B7280]">
                  {expandedSection === 'simulate' ? '−' : '+'}
                </span>
              </button>

              {expandedSection === 'simulate' && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {waitRisk.map((item: any, i: number) => (
                      <div key={i} className="rounded-lg border border-[#E5E7EB] bg-[#FAFCFF] p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="text-sm font-semibold text-[#111]">
                            {item.time}
                          </div>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              color: getLevelColor(item.level),
                              backgroundColor: `${getLevelColor(item.level)}15`
                            }}
                          >
                            {item.level}
                          </span>
                        </div>
                        <div className="text-sm leading-6 text-[#6B7280]">
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 border-t border-[#E5E7EB] pt-6">
            <p className="text-center text-sm text-[#6B7280]">
              Not a medical diagnosis. Always consult healthcare professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}