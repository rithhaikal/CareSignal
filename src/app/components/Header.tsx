/**
 * Shared navigation header displayed across all screens.
 * Contains the CareSignal logo, language toggle button, and event branding.
 * Extracted to eliminate header duplication across 5 different screens.
 */

import type { Language } from '../../types';

interface HeaderProps {
  /** Current active language */
  language: Language;
  /** Callback to switch between EN and BM */
  onToggleLanguage: () => void;
  /** Optional additional CSS classes (e.g. 'mb-12' for inner pages) */
  className?: string;
}

export function Header({ language, onToggleLanguage, className = '' }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm ${className}`}
    >
      {/* App logo */}
      <div className="text-xl font-bold text-[#111]">
        <span className="text-[#2D8A3E]">Care</span>Signal
      </div>

      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <button
          onClick={onToggleLanguage}
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-[#111] transition-colors hover:border-[#111]"
        >
          {language === 'en' ? 'BM' : 'EN'}
        </button>

        {/* Event branding */}
        <span className="text-sm font-semibold text-gray-700">
          Build with AI 2026
        </span>
      </div>
    </header>
  );
}
