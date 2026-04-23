/**
 * Follow-up chat panel — allows users to ask contextual questions
 * after receiving their symptom assessment. Supports multi-turn
 * conversation with Gemini, maintaining assessment context throughout.
 *
 * Features:
 * - Suggestion chips for common questions
 * - Multi-turn conversation history
 * - Bilingual support (EN/BM)
 * - Loading indicators and error fallbacks
 */

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../utils/gemini';
import type { Language, Severity, ChatMessage } from '../../types';

interface ChatPanelProps {
  /** User's selected symptoms from the assessment */
  symptoms: string[];
  /** Assessed severity level */
  severity: Severity;
  /** How long symptoms have lasted */
  duration: string;
  /** User's age group */
  ageGroup: string;
  /** Current active language */
  language: Language;
}

/** Suggested follow-up questions shown before conversation starts */
const SUGGESTIONS = {
  en: [
    'Can I take paracetamol?',
    'Should I eat anything specific?',
    'When exactly should I worry?',
    'Can I still exercise?',
  ],
  bm: [
    'Boleh ambil paracetamol?',
    'Patut makan apa?',
    'Bila perlu risau?',
    'Boleh bersenam tak?',
  ],
};

export function ChatPanel({ symptoms, severity, duration, ageGroup, language }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Bilingual UI labels
  const t = {
    en: {
      title: 'Ask CareSignal',
      subtitle: 'Follow-up questions about your assessment',
      placeholder: 'Type your question...',
      disclaimer: 'Not medical advice. Always consult a professional.',
    },
    bm: {
      title: 'Tanya CareSignal',
      subtitle: 'Soalan susulan tentang penilaian anda',
      placeholder: 'Taip soalan anda...',
      disclaimer: 'Bukan nasihat perubatan. Sentiasa rujuk profesional.',
    },
  }[language];

  /** Auto-scroll to bottom when new messages arrive */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** Maximum number of messages allowed in a single conversation session */
  const MAX_MESSAGES = 50;

  /** Sends a message and appends the AI response */
  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading || messages.length >= MAX_MESSAGES) return;

    const userMessage: ChatMessage = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const reply = await sendChatMessage(updatedMessages, {
      symptoms,
      severity,
      duration,
      ageGroup,
      language,
    });

    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setIsLoading(false);
  };

  // -------------------------------------------------------------------------
  // Collapsed state — floating button
  // -------------------------------------------------------------------------
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#0B1A24] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <span className="text-base">💬</span>
        {t.title}
      </button>
    );
  }

  // -------------------------------------------------------------------------
  // Expanded state — chat panel
  // -------------------------------------------------------------------------
  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[380px] flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl max-sm:bottom-0 max-sm:right-0 max-sm:left-0 max-sm:w-full max-sm:rounded-b-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
        <div>
          <div className="text-sm font-bold text-[#0B1A24]">{t.title}</div>
          <div className="text-xs text-[#6B7280]">{t.subtitle}</div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-1 text-lg text-[#6B7280] transition-colors hover:bg-gray-100 hover:text-[#111]"
        >
          ✕
        </button>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ minHeight: '220px', maxHeight: '340px' }}
      >
        {/* Suggestion chips — shown before any messages */}
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-[#9CA3AF] text-center mb-3">{t.subtitle}</p>
            {SUGGESTIONS[language].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="block w-full rounded-lg border border-[#E5E7EB] bg-[#FAFCFF] px-3 py-2.5 text-left text-sm text-[#111] transition-colors hover:border-[#2D8A3E] hover:bg-[#F0FDF4]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Conversation messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0B1A24] text-white'
                  : 'border border-[#CFE9D8] bg-[#F0FDF4] text-[#111]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-[#CFE9D8] bg-[#F0FDF4] px-4 py-3 text-sm text-[#6B7280]">
              <span className="inline-flex gap-1 text-lg leading-none">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>·</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-[#E5E7EB] px-4 py-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#111] focus:border-[#2D8A3E] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-lg bg-[#0B1A24] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-30"
          >
            ↑
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-[#9CA3AF]">{t.disclaimer}</p>
      </div>
    </div>
  );
}
