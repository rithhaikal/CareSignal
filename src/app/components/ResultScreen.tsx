import { useState } from 'react';

interface ResultScreenProps {
  severity: 'safe' | 'clinic' | 'emergency';
  guidance?: any;
  onSimulate: () => void;
  onRestart: () => void;
}

const RESULTS = {
  safe: {
    label: 'SAFE TO MONITOR',
    subLabel: 'Low Risk • Confidence: High',
    color: '#2D8A3E',
    action: 'Monitor at home',
    explanation: 'Your symptoms appear manageable at home with monitoring.',
    timeline: {
      morning: ['Rest and stay hydrated', 'Monitor temperature'],
      afternoon: ['Light meals if appetite returns'],
      night: ['Track any changes in symptoms']
    },
    whenToAct: [
      'Symptoms worsen significantly',
      'New severe symptoms appear',
      'Unable to keep fluids down'
    ],
    waitRisk: [
      { time: 'NOW', risk: '15%', desc: 'Symptoms manageable' },
      { time: '+24H', risk: '35%', desc: 'May require clinic visit' },
      { time: '+48H', risk: '55%', desc: 'Complications possible' }
    ]
  },
  clinic: {
    label: 'VISIT CLINIC',
    subLabel: 'Moderate Risk • Confidence: High',
    color: '#E67700',
    action: 'Schedule clinic appointment within 24 hours',
    explanation: 'You should see a healthcare provider soon.',
    timeline: {
      morning: ['Schedule clinic appointment', 'Prepare symptom list'],
      afternoon: ['Attend appointment if available'],
      night: ['Follow provider instructions']
    },
    whenToAct: [
      'Breathing becomes difficult',
      'Severe chest pain develops',
      'Confusion or extreme weakness'
    ],
    waitRisk: [
      { time: 'NOW', risk: '40%', desc: 'Clinic visit recommended' },
      { time: '+24H', risk: '70%', desc: 'ER may be required' },
      { time: '+48H', risk: '90%', desc: 'Serious complications likely' }
    ]
  },
  emergency: {
    label: 'SEEK EMERGENCY CARE',
    subLabel: 'High Risk • Confidence: High',
    color: '#C92A2A',
    action: 'Go to emergency department now',
    explanation: 'Your symptoms indicate a potentially serious condition.',
    timeline: {
      morning: ['Go to emergency room immediately', 'Call 911 if needed'],
      afternoon: ['Do not delay treatment'],
      night: ['Do not drive yourself']
    },
    whenToAct: [
      'Loss of consciousness',
      'Severe difficulty breathing',
      'Uncontrolled bleeding'
    ],
    waitRisk: [
      { time: 'NOW', risk: '75%', desc: 'Immediate care needed' },
      { time: '+24H', risk: '95%', desc: 'Life-threatening' },
      { time: '+48H', risk: '100%', desc: 'Permanent damage possible' }
    ]
  }
};

export function ResultScreen({ severity, guidance, onSimulate, onRestart }: ResultScreenProps) {
  const result = RESULTS[severity];
  
  const explanation = guidance?.explanation || result.explanation;
  const morningTimeline = guidance?.next24h?.morning || result.timeline.morning;
  const afternoonTimeline = guidance?.next24h?.afternoon || result.timeline.afternoon;
  const nightTimeline = guidance?.next24h?.night || result.timeline.night;
  const warningSigns = guidance?.warningSigns || result.whenToAct;
  
  const waitRisk = result.waitRisk.map((item, index) => {
    if (guidance?.ifYouWait && guidance.ifYouWait[index]) {
      return { ...item, desc: guidance.ifYouWait[index] };
    }
    return item;
  });

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Decision Label */}
        <div className="mb-6">
          <h1
            className="text-5xl md:text-6xl tracking-tight leading-[1.05] mb-3"
            style={{ color: result.color }}
          >
            {result.label}
          </h1>
          <p className="text-base text-[#6B7280]">
            {result.subLabel}
          </p>
        </div>

        {/* Action */}
        <div className="mb-8">
          <div className="text-xl text-[#111] mb-2">{result.action}</div>
          <p className="text-base text-[#6B7280]">{explanation}</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <button
            onClick={onRestart}
            className="bg-[#111] text-white py-3 px-8 text-sm hover:bg-[#2B7A78] transition-colors"
          >
            Check again
          </button>
          <button
            onClick={() => toggleSection('details')}
            className="border border-[#E5E7EB] text-[#111] py-3 px-8 text-sm hover:border-[#111] transition-colors"
          >
            View details
          </button>
        </div>

        {/* COLLAPSIBLE DETAILS */}
        <div className="space-y-1 border-t border-[#E5E7EB]">
          {/* Next 24 Hours */}
          <div className="border-b border-[#E5E7EB]">
            <button
              onClick={() => toggleSection('timeline')}
              className="w-full py-5 flex items-center justify-between text-left hover:text-[#2B7A78] transition-colors"
            >
              <span className="text-lg text-[#111]">Next 24 Hours</span>
              <span className="text-xl text-[#6B7280]">{expandedSection === 'timeline' ? '−' : '+'}</span>
            </button>

            {expandedSection === 'timeline' && (
              <div className="pb-6 animate-fadeIn">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-3">MORNING</div>
                    <ul className="space-y-2">
                      {morningTimeline.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-[#111] pl-3 border-l border-[#E5E7EB]">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-3">AFTERNOON</div>
                    <ul className="space-y-2">
                      {afternoonTimeline.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-[#111] pl-3 border-l border-[#E5E7EB]">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-3">NIGHT</div>
                    <ul className="space-y-2">
                      {nightTimeline.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-[#111] pl-3 border-l border-[#E5E7EB]">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warning Signs */}
          <div className="border-b border-[#E5E7EB]">
            <button
              onClick={() => toggleSection('warnings')}
              className="w-full py-5 flex items-center justify-between text-left hover:text-[#2B7A78] transition-colors"
            >
              <span className="text-lg text-[#111]">Warning Signs</span>
              <span className="text-xl text-[#6B7280]">{expandedSection === 'warnings' ? '−' : '+'}</span>
            </button>

            {expandedSection === 'warnings' && (
              <div className="pb-6 animate-fadeIn">
                <div className="text-xs text-[#C92A2A] uppercase tracking-wider mb-3">SEEK IMMEDIATE CARE IF</div>
                <ul className="space-y-2">
                  {warningSigns.map((item: string, i: number) => (
                    <li key={i} className="text-sm text-[#111]">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* If You Wait */}
          <div className="border-b border-[#E5E7EB]">
            <button
              onClick={() => toggleSection('wait')}
              className="w-full py-5 flex items-center justify-between text-left hover:text-[#2B7A78] transition-colors"
            >
              <span className="text-lg text-[#111]">If You Wait</span>
              <span className="text-xl text-[#6B7280]">{expandedSection === 'wait' ? '−' : '+'}</span>
            </button>

            {expandedSection === 'wait' && (
              <div className="pb-6 animate-fadeIn">
                <div className="space-y-4">
                  {waitRisk.map((item: any, i: number) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="text-base text-[#111]">{item.time}</div>
                        <div className="text-sm text-[#6B7280]">{item.risk} risk</div>
                      </div>
                      <div className="h-1 bg-[#F3F4F6]">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: item.risk,
                            backgroundColor: parseInt(item.risk) > 60 ? '#C92A2A' : parseInt(item.risk) > 30 ? '#E67700' : '#2D8A3E'
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-[#6B7280] mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] text-center">
            Not a medical diagnosis. Always consult healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
