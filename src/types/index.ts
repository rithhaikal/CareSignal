/**
 * Shared TypeScript type definitions for CareSignal.
 * Centralizes all domain types used across components and utilities.
 */

// ---------------------------------------------------------------------------
// Core Application Types
// ---------------------------------------------------------------------------

/** Application screen states representing the user flow */
export type Screen = 'landing' | 'symptoms' | 'info' | 'loading' | 'result';

/** Risk severity levels determined by symptom assessment */
export type Severity = 'safe' | 'clinic' | 'emergency';

/** Supported application languages */
export type Language = 'en' | 'bm';

// ---------------------------------------------------------------------------
// Gemini API Types
// ---------------------------------------------------------------------------

/** Request payload sent to the backend Gemini API proxy */
export interface GuidanceRequest {
  selectedSymptoms: string[];
  duration: string;
  ageGroup: string;
  risk: string;
  action: string;
  otherSymptom: string;
  language?: Language;
}

/** Structured AI guidance response returned by Gemini */
export interface GuidanceResponse {
  explanation: string;
  next24h: {
    morning: string[];
    afternoon: string[];
    night: string[];
  };
  warningSigns: string[];
  ifYouWait: string[];
}

// ---------------------------------------------------------------------------
// Localization Types
// ---------------------------------------------------------------------------

/** Bilingual text pair for EN/BM localization */
export interface LocalizedText {
  en: string;
  bm: string;
}

/** Bilingual string array pair for EN/BM localization */
export interface LocalizedList {
  en: string[];
  bm: string[];
}

// ---------------------------------------------------------------------------
// Result Screen Types
// ---------------------------------------------------------------------------

/** Timeline risk escalation item used in the "If Things Change" section */
export interface WaitRiskItem {
  time: string;
  level: string;
  desc: string;
}

/** Configuration for a single severity result (safe / clinic / emergency) */
export interface ResultConfig {
  label: LocalizedText;
  subLabel: LocalizedText;
  color: string;
  action: LocalizedText;
  explanation: LocalizedText;
  timeline: {
    morning: LocalizedList;
    afternoon: LocalizedList;
    night: LocalizedList;
  };
  whenToAct: LocalizedList;
  waitRisk: {
    en: WaitRiskItem[];
    bm: WaitRiskItem[];
  };
}

// ---------------------------------------------------------------------------
// Chat Types (Follow-up Conversation)
// ---------------------------------------------------------------------------

/** Single message in the follow-up chat conversation */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Context passed to the chat API for follow-up conversations */
export interface ChatContext {
  symptoms: string[];
  severity: string;
  duration: string;
  ageGroup: string;
  language: string;
}
