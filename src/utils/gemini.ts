/**
 * Gemini API client for generating AI-powered health guidance.
 * Communicates with the Express backend proxy at /api/gemini
 * to keep the API key server-side.
 *
 * Includes built-in fallback responses so users always receive
 * basic next-step advice even when the AI service is unavailable.
 */

import type { Language, GuidanceRequest, GuidanceResponse, ChatMessage, ChatContext } from '../types';

// ---------------------------------------------------------------------------
// Fallback Guidance
// ---------------------------------------------------------------------------

/**
 * Returns static fallback guidance when the AI service is unavailable.
 * Ensures users always receive basic next-step advice regardless of API status.
 */
function getFallbackGuidance(language: Language = 'en'): GuidanceResponse {
  if (language === 'bm') {
    return {
      explanation:
        'Berdasarkan simptom yang dipilih dan tahap risiko semasa, anda disarankan untuk terus memantau keadaan dan mengikuti panduan di bawah.',
      next24h: {
        morning: [
          'Minum air secukupnya dan elakkan aktiviti berat',
          'Periksa semula keadaan anda selepas beberapa jam',
        ],
        afternoon: [
          'Ambil makanan ringan jika selera makan normal',
          'Pantau jika ada simptom yang semakin teruk',
        ],
        night: [
          'Berehat lebih awal dan nilai semula simptom sebelum tidur',
          'Dapatkan rawatan jika simptom menjadi semakin teruk',
        ],
      },
      warningSigns: [
        'Sesak nafas',
        'Sakit dada yang teruk',
        'Kekeliruan atau kelemahan yang semakin teruk',
        'Tidak dapat minum atau makan dengan baik',
      ],
      ifYouWait: [
        'Jika simptom kekal sama selama 24 jam, penilaian semula mungkin diperlukan.',
        'Jika simptom menjadi lebih teruk, dapatkan rawatan perubatan dengan lebih segera.',
        'Jika tanda amaran serius muncul secara tiba-tiba, jangan terus pantau di rumah.',
      ],
    };
  }

  return {
    explanation:
      'Based on the symptoms selected and the current risk level, you should continue monitoring closely and follow the guidance below.',
    next24h: {
      morning: [
        'Drink water regularly and avoid strenuous activity',
        'Recheck how you feel after a few hours',
      ],
      afternoon: [
        'Eat light meals if your appetite is normal',
        'Monitor for any worsening symptoms',
      ],
      night: [
        'Rest early and reassess your symptoms before sleep',
        'Seek care if symptoms become significantly worse',
      ],
    },
    warningSigns: [
      'Difficulty breathing',
      'Severe chest pain',
      'Worsening confusion or weakness',
      'Unable to keep fluids down',
    ],
    ifYouWait: [
      'If symptoms stay the same for 24 hours, reassessment may be needed.',
      'If symptoms worsen, seek medical attention sooner.',
      'If severe warning signs appear suddenly, do not continue monitoring at home.',
    ],
  };
}

// ---------------------------------------------------------------------------
// API Client
// ---------------------------------------------------------------------------

/**
 * Sends symptom data to the backend Gemini proxy and returns structured guidance.
 * Falls back to static responses on network errors or non-OK status codes.
 *
 * @param request - Symptom data and user context for the AI prompt
 * @returns Structured guidance with explanation, timeline, warnings, and escalation info
 */
export async function generateGuidance(request: GuidanceRequest): Promise<GuidanceResponse> {
  const {
    selectedSymptoms,
    duration,
    ageGroup,
    otherSymptom,
    language = 'en',
  } = request;

  const fallback = getFallbackGuidance(language as Language);

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selectedSymptoms,
        duration,
        ageGroup,
        otherSymptom,
        language,
      }),
    });

    if (!response.ok) {
      console.error('Backend API error:', response.status);
      return fallback;
    }

    return await response.json();
  } catch (error) {
    console.error('Network error:', error);
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// Chat Client (Follow-up Conversation)
// ---------------------------------------------------------------------------

/**
 * Sends a follow-up chat message to the backend and returns the AI reply.
 * Maintains conversation context (symptoms, severity) across multiple turns.
 *
 * @param messages - Full conversation history so far
 * @param context  - Assessment context (symptoms, severity, duration, etc.)
 * @returns AI reply text, or a fallback message on error
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  context: ChatContext
): Promise<string> {
  const fallbackMessage =
    context.language === 'bm'
      ? 'Maaf, saya tidak dapat menjawab sekarang. Sila cuba lagi.'
      : 'Sorry, I cannot respond right now. Please try again.';

  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, context }),
    });

    if (!response.ok) {
      console.error('Chat API error:', response.status);
      return fallbackMessage;
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Chat network error:', error);
    return fallbackMessage;
  }
}
