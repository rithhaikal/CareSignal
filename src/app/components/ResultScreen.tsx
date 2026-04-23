/**
 * Result screen — displays the severity assessment and AI-generated guidance.
 * Shows the risk level, recommended action, 24-hour timeline, warning signs,
 * and escalation guidance. Supports bilingual display and language switching.
 *
 * Data sources:
 * - Static result config from `resultData.ts` (always available)
 * - AI-generated guidance from Gemini (overlays static data when available)
 */

import { useState } from 'react';
import { Header } from './Header';
import { RESULTS } from '../data/resultData';
import type { Language, Severity, GuidanceResponse, WaitRiskItem } from '../../types';

interface ResultScreenProps {
  /** Assessed severity level */
  severity: Severity;
  /** AI-generated guidance (null if not yet loaded or unavailable) */
  guidance?: GuidanceResponse | null;
  /** Whether a language translation is currently being fetched */
  isTranslating: boolean;
  /** Callback to restart the assessment */
  onRestart: () => void;
  /** Callback to open Google Maps for nearby care */
  onFindCare: () => void;
  /** Current active language */
  language: Language;
  /** Callback to switch between EN and BM */
  onToggleLanguage: () => void;
}

export function ResultScreen({
  severity, guidance, isTranslating, onRestart,
  onFindCare, language, onToggleLanguage,
}: ResultScreenProps) {
  const result = RESULTS[severity];

  // -------------------------------------------------------------------------
  // Bilingual UI labels
  // -------------------------------------------------------------------------
  const uiText = {
    en: {
      assessmentResult: 'Assessment result',
      next24: 'Next 24 Hours',
      morning: 'Morning',
      afternoon: 'Afternoon',
      night: 'Night',
      warningSigns: 'Warning Signs',
      seekSooner: 'Seek care sooner if',
      ifThingsChange: 'If Things Change',
      checkAgain: 'Check Again',
      findClinic: 'Find Nearby Clinic',
      findHospital: 'Find Nearby Hospital',
      disclaimer: 'Not a medical diagnosis. Always consult healthcare professionals.',
    },
    bm: {
      assessmentResult: 'Keputusan penilaian',
      next24: '24 Jam Seterusnya',
      morning: 'Pagi',
      afternoon: 'Petang',
      night: 'Malam',
      warningSigns: 'Tanda Amaran',
      seekSooner: 'Dapatkan rawatan lebih awal jika',
      ifThingsChange: 'Jika Keadaan Berubah',
      checkAgain: 'Semak Semula',
      findClinic: 'Cari Klinik Berdekatan',
      findHospital: 'Cari Hospital Berdekatan',
      disclaimer: 'Ini bukan diagnosis perubatan. Sentiasa rujuk kepada profesional kesihatan.',
    },
  };

  const t = uiText[language];
  const [expandedSection, setExpandedSection] = useState<string | null>('timeline');

  /** Toggles accordion sections open/closed */
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  /** Maps risk level keywords to severity colors for badges */
  const getLevelColor = (level: string) => {
    const lower = level.toLowerCase();
    if (
      lower.includes('critical') || lower.includes('severe') || lower.includes('immediate') ||
      lower.includes('kritikal') || lower.includes('serius') || lower.includes('segera')
    ) return '#C92A2A';
    if (
      lower.includes('clinic') || lower.includes('higher') || lower.includes('reassess') ||
      lower.includes('urgent') || lower.includes('klinik') || lower.includes('tinggi') ||
      lower.includes('nilai')
    ) return '#E67700';
    return '#2D8A3E';
  };

  // -------------------------------------------------------------------------
  // Language switching loading state
  // -------------------------------------------------------------------------
  if (isTranslating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
          <Header language={language} onToggleLanguage={onToggleLanguage} className="mb-12" />
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center py-24">
            <div className="w-14 h-14 border-4 border-[#D1D5DB] border-t-[#0B1A24] rounded-full animate-spin mb-8"></div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
              {language === 'bm' ? 'Menukar bahasa' : 'Switching language'}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B1A24] mb-4">
              {language === 'bm' ? 'Memuatkan panduan anda' : 'Loading your guidance'}
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-[#6B7280]">
              {language === 'bm' ? 'Sedang mendapatkan versi bahasa yang dipilih.' : 'Fetching the selected language version now.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Merge AI guidance with static fallback data
  // -------------------------------------------------------------------------
  const explanation = guidance?.explanation || result.explanation[language];
  const morningTimeline = guidance?.next24h?.morning || result.timeline.morning[language];
  const afternoonTimeline = guidance?.next24h?.afternoon || result.timeline.afternoon[language];
  const nightTimeline = guidance?.next24h?.night || result.timeline.night[language];
  const warningSigns = guidance?.warningSigns || result.whenToAct[language];

  // Transform AI ifYouWait array into WaitRiskItem format, or use static data
  const waitRisk: WaitRiskItem[] = guidance?.ifYouWait?.length
    ? [
        { time: language === 'en' ? 'Now' : 'Sekarang', level: language === 'en' ? 'Current state' : 'Keadaan semasa', desc: guidance.ifYouWait[0] },
        { time: language === 'en' ? '+24 Hours' : '+24 Jam', level: language === 'en' ? 'If still not improving' : 'Jika masih tidak pulih', desc: guidance.ifYouWait[1] },
        { time: language === 'en' ? '+48 Hours' : '+48 Jam', level: language === 'en' ? 'If symptoms worsen' : 'Jika simptom bertambah teruk', desc: guidance.ifYouWait[2] },
      ]
    : result.waitRisk[language];

  const careButtonLabel = severity === 'emergency' ? t.findHospital : t.findClinic;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF7EF] via-white to-white font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
        <Header language={language} onToggleLanguage={onToggleLanguage} className="mb-12" />

        <div className="max-w-4xl mx-auto">
          {/* Severity banner */}
          <div className="mb-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#2D8A3E]">
              {t.assessmentResult}
            </p>
            <div
              className="rounded-xl border px-6 py-6 mb-5"
              style={{
                borderColor: result.color,
                backgroundColor: severity === 'safe' ? '#F0FDF4' : severity === 'clinic' ? '#FFF7ED' : '#FEF2F2',
              }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-2" style={{ color: result.color }}>
                {result.label[language]}
              </h1>
              <p className="text-sm font-medium text-[#6B7280]">{result.subLabel[language]}</p>
            </div>

            {/* Action and explanation */}
            <div className="mb-8">
              <div className="text-xl font-semibold text-[#111] mb-3">{result.action[language]}</div>
              <p className="max-w-3xl text-base md:text-lg text-[#4B5563] leading-relaxed">{explanation}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onRestart} className="rounded-lg bg-[#0B1A24] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
                {t.checkAgain}
              </button>
              <button onClick={onFindCare} className="rounded-lg border border-[#E5E7EB] bg-white px-8 py-3 text-sm font-semibold text-[#111] transition-colors hover:border-[#111]">
                {careButtonLabel}
              </button>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            {/* Next 24 Hours */}
            <div className="border-b border-[#E5E7EB]">
              <button onClick={() => toggleSection('timeline')} className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]">
                <span className="text-lg font-semibold text-[#111]">{t.next24}</span>
                <span className="text-xl text-[#6B7280]">{expandedSection === 'timeline' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'timeline' && (
                <div className="px-6 pb-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      { label: t.morning, items: morningTimeline },
                      { label: t.afternoon, items: afternoonTimeline },
                      { label: t.night, items: nightTimeline },
                    ].map((period) => (
                      <div key={period.label}>
                        <div className="mb-3 text-xs uppercase tracking-wider text-[#6B7280]">{period.label}</div>
                        <ul className="space-y-2">
                          {period.items.map((item: string, i: number) => (
                            <li key={i} className="border-l border-[#D1D5DB] pl-3 text-sm text-[#111]">{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Warning Signs */}
            <div className="border-b border-[#E5E7EB]">
              <button onClick={() => toggleSection('warnings')} className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]">
                <span className="text-lg font-semibold text-[#111]">{t.warningSigns}</span>
                <span className="text-xl text-[#6B7280]">{expandedSection === 'warnings' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'warnings' && (
                <div className="px-6 pb-6">
                  <div className="mb-3 text-xs uppercase tracking-wider text-[#C92A2A]">{t.seekSooner}</div>
                  <ul className="space-y-2">
                    {warningSigns.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-[#111]">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* If Things Change */}
            <div>
              <button onClick={() => toggleSection('simulate')} className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#FAFCFF]">
                <span className="text-lg font-semibold text-[#111]">{t.ifThingsChange}</span>
                <span className="text-xl text-[#6B7280]">{expandedSection === 'simulate' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'simulate' && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {waitRisk.map((item: WaitRiskItem, i: number) => (
                      <div key={i} className="rounded-lg border border-[#E5E7EB] bg-[#FAFCFF] p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="text-sm font-semibold text-[#111]">{item.time}</div>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ color: getLevelColor(item.level), backgroundColor: `${getLevelColor(item.level)}15` }}
                          >
                            {item.level}
                          </span>
                        </div>
                        <div className="text-sm leading-6 text-[#6B7280]">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-10 border-t border-[#E5E7EB] pt-6">
            <p className="text-center text-sm text-[#6B7280]">{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}