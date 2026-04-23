/**
 * Express backend server for CareSignal.
 *
 * Responsibilities:
 * - Proxies Gemini API calls to keep the API key server-side
 * - Validates incoming request payloads
 * - Applies rate limiting and security headers
 * - Serves the production React build and handles SPA routing
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

/** Security headers (XSS protection, content-type sniffing, etc.) */
app.use(helmet({ contentSecurityPolicy: false }));

/** CORS — restrict origins in production via ALLOWED_ORIGINS env var */
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
  })
);

app.use(express.json());

/** Trust proxy — required for Cloud Run so rate-limiter gets the real IP */
app.set("trust proxy", 1);

/** Rate limiting — 30 requests per 15 minutes per IP on API routes */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/", apiLimiter);

/** Serve the built React app */
app.use(express.static(path.join(__dirname, "dist")));

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

/**
 * POST /api/gemini
 * Accepts symptom data, generates AI guidance via Gemini, and returns
 * structured JSON. Includes input validation and retry logic with
 * exponential backoff for transient API errors.
 */
app.post("/api/gemini", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  // -----------------------------------------------------------------------
  // Input validation
  // -----------------------------------------------------------------------
  const {
    selectedSymptoms,
    duration,
    ageGroup,
    otherSymptom,
    language = "en",
  } = req.body;

  if (!Array.isArray(selectedSymptoms)) {
    return res
      .status(400)
      .json({ error: "selectedSymptoms must be an array" });
  }

  // Allow through if either predefined symptoms or a custom symptom is provided
  if (selectedSymptoms.length === 0 && (!otherSymptom || !otherSymptom.trim())) {
    return res
      .status(400)
      .json({ error: "At least one symptom (selected or custom) is required" });
  }

  // Build a combined symptom list for the AI prompt
  const allSymptoms = [...selectedSymptoms];
  if (otherSymptom && otherSymptom.trim()) {
    allSymptoms.push(otherSymptom.trim());
  }
  if (typeof duration !== "string" || !duration.trim()) {
    return res.status(400).json({ error: "duration is required" });
  }
  if (typeof ageGroup !== "string" || !ageGroup.trim()) {
    return res.status(400).json({ error: "ageGroup is required" });
  }
  if (!["en", "bm"].includes(language)) {
    return res.status(400).json({ error: "language must be 'en' or 'bm'" });
  }

  // -----------------------------------------------------------------------
  // Gemini API call
  // -----------------------------------------------------------------------
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 600,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are a healthcare triage and guidance assistant.
Do NOT diagnose any specific disease or condition.

Your job is to:
1. Assess the severity of the user's symptoms and determine the appropriate risk level
2. Provide practical next-step guidance based on that assessment

All reported symptoms: ${allSymptoms.join(", ")}
Duration: ${duration}
Age group: ${ageGroup}
Language: ${language === "bm" ? "Bahasa Malaysia" : "English"}

SEVERITY ASSESSMENT RULES:
Determine the severity as one of exactly three values: "safe", "clinic", or "emergency".

Use "emergency" if ANY of these apply:
- Symptoms suggest a life-threatening condition (e.g., severe bleeding, unconsciousness, seizure, stroke signs, severe chest pain, inability to breathe, choking, paralysis, severe allergic reaction)
- Multiple severe symptoms combined with prolonged duration
- Symptoms in elderly (65+) that indicate rapid deterioration

Use "clinic" if ANY of these apply:
- Symptoms are concerning but not immediately life-threatening (e.g., persistent fever, blood in urine/stool, moderate pain lasting days, worsening rash, signs of infection)
- 3 or more symptoms present together
- Symptoms have lasted more than 2 days without improvement
- Patient is elderly (65+) with any notable symptoms
- Symptoms that need professional assessment but not emergency care

Use "safe" if:
- Symptoms are mild and manageable at home (e.g., mild headache, slight cough, minor fatigue)
- Fewer than 3 mild symptoms
- Short duration with no red flags

Return valid JSON only in this exact shape:
{
  "severity": "safe" | "clinic" | "emergency",
  "explanation": "2 to 3 sentences explaining why this severity level was determined, referencing the specific symptoms and duration in a practical and human way",
  "next24h": {
    "morning": ["specific action 1", "specific action 2"],
    "afternoon": ["specific action 1", "specific action 2"],
    "night": ["specific action 1", "specific action 2"]
  },
  "warningSigns": ["3 or 4 warning signs relevant to the reported symptoms that would require escalation"],
  "ifYouWait": ["what to do if symptoms stay the same", "what to do if symptoms worsen", "when to seek urgent help immediately"]
}

Rules:
- The severity field MUST be exactly one of: "safe", "clinic", "emergency"
- Do not diagnose or name specific diseases unless absolutely necessary
- Be practical and specific to the symptoms reported
- Avoid generic filler
- Keep wording calm, useful, and easy to understand
- Focus on next steps, not medical certainty
- Your explanation and tone MUST match the severity: emergency = urgent, clinic = important, safe = reassuring
- Return the full response in ${language === "bm" ? "Bahasa Malaysia" : "English"}
${language === "bm" ? "- Use natural, simple Malaysian Malay\n- Avoid overly formal government-style language" : ""}
`;

    // Retry logic with exponential backoff for transient API errors
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();

        const parsed = JSON.parse(text);

        // Validate and normalize the AI-returned severity
        const validSeverities = ["safe", "clinic", "emergency"];
        if (!parsed.severity || !validSeverities.includes(parsed.severity)) {
          parsed.severity = "clinic"; // Default to clinic if AI returns invalid severity
        }

        return res.json(parsed);
      } catch (err) {
        lastError = err;
        const status = err?.status || err?.statusCode;
        const message = err?.message || "";
        const isRetryable =
          status === 503 ||
          status === 429 ||
          message.includes("high demand") ||
          message.includes("Service Unavailable");

        if (isRetryable && attempt < 2) {
          await new Promise((r) => setTimeout(r, (attempt + 1) * 2000));
          continue;
        }
        break;
      }
    }

    console.error("Gemini API error:", lastError);
    return res.status(502).json({ error: "AI service temporarily unavailable" });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------------------------------------------------------
// Chat API (Multi-turn Follow-up Conversation)
// ---------------------------------------------------------------------------

/**
 * POST /api/gemini/chat
 * Handles multi-turn follow-up conversations after an assessment.
 * Receives the full conversation history and assessment context,
 * enabling Gemini to provide contextual, personalized responses.
 */
app.post("/api/gemini/chat", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  // Input validation
  const { messages, context } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages must be a non-empty array" });
  }
  if (!context || !Array.isArray(context.symptoms) || !context.severity) {
    return res
      .status(400)
      .json({ error: "context with symptoms and severity is required" });
  }

  const language = context.language || "en";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 300,
      },
    });

    // Build conversation history string for the prompt
    const conversationHistory = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `You are CareSignal, a healthcare guidance assistant. You are having a follow-up conversation with a user who just completed a symptom assessment.

Assessment context:
- Symptoms: ${context.symptoms.join(", ")}
- Severity level: ${context.severity}
- Duration: ${context.duration || "Not specified"}
- Age group: ${context.ageGroup || "Not specified"}

Rules:
- Do NOT diagnose any condition or disease
- Do NOT prescribe specific medication or dosages
- Be helpful, calm, and practical
- Keep responses concise (2-4 sentences max)
- If asked about medication, advise consulting a pharmacist or doctor
- Focus on practical self-care and general wellness advice
- Respond in ${language === "bm" ? "Bahasa Malaysia (natural, simple)" : "English"}
${language === "bm" ? "- Use natural, simple Malaysian Malay\n- Avoid overly formal language" : ""}

Conversation:
${conversationHistory}

Respond to the user's latest message naturally and helpfully.`;

    // Retry logic with exponential backoff for transient API errors
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const reply = result.response.text().trim();
        return res.json({ reply });
      } catch (err) {
        lastError = err;
        const status = err?.status || err?.statusCode;
        const message = err?.message || "";
        const isRetryable =
          status === 503 ||
          status === 429 ||
          message.includes("high demand") ||
          message.includes("Service Unavailable");

        if (isRetryable && attempt < 2) {
          await new Promise((r) => setTimeout(r, (attempt + 1) * 2000));
          continue;
        }
        break;
      }
    }

    console.error("Chat API error:", lastError);
    return res.status(502).json({ error: "AI service temporarily unavailable" });
  } catch (error) {
    console.error("Chat API server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------------------------------------------------------------------
// SPA Fallback
// ---------------------------------------------------------------------------

/** Catch-all: serve React app for any non-API route (SPA client-side routing) */
app.use((req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  } else {
    next();
  }
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`CareSignal server running on port ${PORT}`);
});
