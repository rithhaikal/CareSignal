import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const FALLBACK_GUIDANCE = {
  explanation:
    "Based on the symptoms selected and the current risk level, you should continue monitoring closely and follow the guidance below.",
  next24h: {
    morning: [
      "Drink water regularly and avoid strenuous activity",
      "Recheck how you feel after a few hours",
    ],
    afternoon: [
      "Eat light meals if your appetite is normal",
      "Monitor for any worsening symptoms",
    ],
    night: [
      "Rest early and reassess your symptoms before sleep",
      "Seek care if symptoms become significantly worse",
    ],
  },
  warningSigns: [
    "Difficulty breathing",
    "Severe chest pain",
    "Worsening confusion or weakness",
    "Unable to keep fluids down",
  ],
  ifYouWait: [
    "If symptoms stay the same for 24 hours, reassessment may be needed.",
    "If symptoms worsen, seek medical attention sooner.",
    "If severe warning signs appear suddenly, do not continue monitoring at home.",
  ],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(model, prompt, retries = 2) {
  try {
    return await model.generateContent(prompt);
  } catch (error) {
    const status = error?.status || error?.statusCode;
    const message = error?.message || "";

    const isRetryable =
      status === 503 ||
      status === 429 ||
      message.includes("high demand") ||
      message.includes("Service Unavailable");

    if (retries > 0 && isRetryable) {
      const delay = (3 - retries) * 2000;
      await sleep(delay);
      return generateWithRetry(model, prompt, retries - 1);
    }

    throw error;
  }
}

export async function generateGuidance({
  selectedSymptoms,
  duration,
  ageGroup,
  risk,
  action,
  otherSymptom,
}) {
  if (!apiKey) {
    return {
      ...FALLBACK_GUIDANCE,
      explanation: "Guidance unavailable because API key is missing.",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 500,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are a healthcare guidance assistant.
Do NOT diagnose.
The risk decision has already been made by the system.

User symptoms: ${selectedSymptoms.join(", ")}
Other symptom: ${otherSymptom || "None"}
Duration: ${duration}
Age group: ${ageGroup}

System risk level: ${risk}
Recommended action: ${action}

Return valid JSON only in this exact shape:
{
  "explanation": "2 to 3 sentences explaining why this result was reached, referencing the selected symptoms and duration in a practical and human way",
  "next24h": {
    "morning": ["specific action 1", "specific action 2"],
    "afternoon": ["specific action 1", "specific action 2"],
    "night": ["specific action 1", "specific action 2"]
  },
  "warningSigns": ["3 or 4 warning signs relevant to the selected symptoms"],
  "ifYouWait": ["what to do if symptoms stay the same", "what to do if symptoms worsen", "when to seek urgent help immediately"]
}

Rules:
- Do not diagnose
- Do not mention diseases unless absolutely necessary
- Be practical and specific to the symptoms
- Avoid generic filler unless relevant
- Keep wording calm, useful, and easy to understand
- Focus on next steps, not medical certainty
`;

    const result = await generateWithRetry(model, prompt, 2);

    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(text);
    } catch {
      return {
        ...FALLBACK_GUIDANCE,
        explanation: text || FALLBACK_GUIDANCE.explanation,
      };
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return FALLBACK_GUIDANCE;
  }
}