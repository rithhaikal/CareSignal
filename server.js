import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve the built React app
app.use(express.static(path.join(__dirname, "dist")));

// Gemini API endpoint
app.post("/api/gemini", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const {
      selectedSymptoms,
      duration,
      ageGroup,
      risk,
      action,
      otherSymptom,
      language = "en",
    } = req.body;

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
Language: ${language === "bm" ? "Bahasa Malaysia" : "English"}

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
- Return the full response in ${language === "bm" ? "Bahasa Malaysia" : "English"}
${language === "bm" ? "- Use natural, simple Malaysian Malay\n- Avoid overly formal government-style language" : ""}
`;

    // Retry logic with exponential backoff
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsed = JSON.parse(text);
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

// Catch-all: serve React app for any other route
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`CareSignal server running on port ${PORT}`);
});
