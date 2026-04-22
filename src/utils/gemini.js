import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const FALLBACK_GUIDANCE = {
  explanation:
    "We couldn't generate a personalized response right now. Please rely on the standard guidance below.",
  next24h: {
    morning: ["Rest", "Drink water"],
    afternoon: ["Monitor symptoms"],
    night: ["Seek care if symptoms worsen"],
  },
  warningSigns: [
    "Difficulty breathing",
    "Severe chest pain",
    "Worsening confusion",
  ],
  ifYouWait: [
    "Symptoms may worsen",
    "Complications may increase",
    "Seek medical attention if symptoms become more severe",
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
      console.warn(`Gemini busy, retrying... (${retries} left)`);
      // Exponential backoff: 2s, 4s...
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
    console.error("Gemini API key missing");
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
        temperature: 0.2,
        maxOutputTokens: 220,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are a healthcare guidance assistant.
Do NOT diagnose.
The triage decision has already been made by the system.

User symptoms: ${selectedSymptoms.join(", ")}
Other symptom: ${otherSymptom || "None"}
Duration: ${duration}
Age group: ${ageGroup}

System risk level: ${risk}
Recommended action: ${action}

Return valid JSON only in this exact shape:
{
  "explanation": "short explanation in plain English, max 2 sentences",
  "next24h": {
    "morning": ["item 1", "item 2"],
    "afternoon": ["item 1", "item 2"],
    "night": ["item 1", "item 2"]
  },
  "warningSigns": ["item 1", "item 2", "item 3"],
  "ifYouWait": ["item 1", "item 2", "item 3"]
}

Rules:
- Keep everything short
- Stay calm and practical
- No diagnosis
- No medical certainty
- Focus on guidance only
`;

    const result = await generateWithRetry(model, prompt, 2);

    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.warn("Failed to parse Gemini JSON. Raw output:", text);
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