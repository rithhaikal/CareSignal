# 🩺 CareSignal

CareSignal is a lightweight symptom checking web app that helps users decide whether to monitor at home, visit a clinic, or seek emergency care based on how they feel. 

It combines rule-based risk logic with AI-generated guidance to provide clear next steps in seconds.

---

## 📸 Screenshots

| Landing Page | Symptom Selection | Result Screen |
|:---:|:---:|:---:|
| <img src="./docs/landing.PNG" width="250" /> | <img src="./docs/symptoms.PNG" width="250" /> | <img src="./docs/result.PNG" width="250" /> |

---

## 🚀 Features

- **Instant Risk Assessment:** Rule-based evaluation determines severity instantly (Safe, Clinic, Emergency).
- **AI Guidance & Follow-up:** Gemini generates structured next steps and allows users to ask contextual follow-up questions.
- **Multilingual:** English 🇬🇧 and Bahasa Malaysia 🇲🇾 support.
- **Nearby Clinics:** Find nearby healthcare facilities via Google Maps integration.

---

## 🏗️ Architecture & Tech Stack

CareSignal uses a lightweight client-server model:
- **Frontend (React 19 + Vite + Tailwind v4):** Handles user flow, rule-based severity calculation, and UI.
- **Backend (Express.js):** A secure proxy server that manages Gemini API requests (keeping your API key hidden) and serves the production build.
- **AI Engine (Google Gemini):** Processes symptom context to return structured guidance and powers the chat.

---

## 📦 Setup

### Prerequisites
- [Node.js](https://nodejs.org/) 20+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation & Run

```bash
git clone https://github.com/rithhaikal/caresignals.git
cd caresignals
npm install

# Setup Environment Variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start Backend (Terminal 1)
node server.js 

# Start Frontend (Terminal 2)
npm run dev
```

The app will be available at `http://localhost:5173`.

### Docker

```bash
docker build -t caresignal .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key caresignal
```

---

## ⚠️ Disclaimer & Limitations

- **Not a medical diagnosis tool.** This application is for informational purposes only and does not replace professional medical advice. Always consult a qualified healthcare provider for medical concerns.
- Uses predefined logic for severity classification, while AI responses provide supplementary guidance.
- AI assisted tools (ChatGPT & Gemini) were used during development for UI iteration and prompt design, but core logic was built manually.
