# 🩺 CareSignal

CareSignal is a lightweight symptom checking web app that helps users decide what to do next based on how they feel. Whether to monitor at home, visit a clinic, or seek emergency care.

It combines rule based risk logic with AI generated guidance to provide clear and structured next steps in seconds.

---

## 📸 Screenshots

### Landing Page
<img src="./docs/landing.png" width="700" />

### Symptom Selection
<img src="./docs/symptoms.png" width="700" />

### Result Screen
<img src="./docs/result.png" width="700" />

---

## 🚀 Features

<<<<<<< HEAD
- Select symptoms from a predefined list
- Add custom symptoms manually
- Instant risk assessment (Safe, Clinic, Emergency)
- AI-generated guidance for next 24 hours
- Warning signs and escalation triggers
- English 🇬🇧 / Bahasa Malaysia 🇲🇾 support
- Find nearby clinics or hospitals via Google Maps
=======
- Select symptoms from a predefined list  
- Add custom symptoms manually  
- Instant risk assessment (Safe, Clinic, Emergency)  
- AI generated guidance for next 24 hours  
- Warning signs and escalation triggers  
- English 🇬🇧 and Bahasa Malaysia 🇲🇾 support  
- Find nearby clinics or hospitals via Google Maps  
>>>>>>> 2811bf93e92463623967c570288e7a4f76479aaf

---

## ⚡ How It Works

<<<<<<< HEAD
1. **Symptom Input**
   Users select predefined symptoms or add their own

2. **Risk Evaluation**
   A rule-based system determines severity instantly

3. **AI Guidance**
   Gemini generates structured next steps, timelines, and warning signs

4. **Language Toggle**
   Users can switch between English and Bahasa Malaysia

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                   Client                      │
│  React + TypeScript + Tailwind CSS            │
│                                               │
│  LandingPage → SymptomScreen →                │
│  AdditionalInfoScreen → ResultScreen          │
│                                               │
│  Rule-based severity:  calculateSeverity()    │
│  AI guidance:          generateGuidance()     │
└──────────────────┬───────────────────────────┘
                   │ POST /api/gemini
                   ▼
┌──────────────────────────────────────────────┐
│                  Server                       │
│  Express.js (Node.js)                         │
│                                               │
│  • Proxies Gemini API (key stays server-side) │
│  • Retry logic with exponential backoff       │
│  • Input validation & rate limiting           │
│  • Security headers via Helmet                │
│  • Serves production build (SPA)              │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│           Google Gemini API                   │
│  gemini-flash-lite-latest                     │
│  Structured JSON response (no diagnosis)      │
└──────────────────────────────────────────────┘
```
=======
1. Symptom Input  
   Users select predefined symptoms or add their own  

2. Risk Evaluation  
   A rule based system determines severity instantly  

3. AI Guidance  
   Gemini generates structured next steps, timelines, and warning signs  

4. Language Toggle  
   Users can switch between English and Bahasa Malaysia  
>>>>>>> 2811bf93e92463623967c570288e7a4f76479aaf

---

## 🧠 Tech Stack

<<<<<<< HEAD
| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini API (`gemini-flash-lite-latest`) |
| Backend | Express.js (Node.js) |
| Security | Helmet, express-rate-limit, CORS |
| Deployment | Docker, Google Cloud Run |
| State | React Hooks |

---

## 📁 Project Structure

```
caresignal/
├── server.js                  # Express backend (API proxy + static serving)
├── Dockerfile                 # Multi-stage Docker build
├── .env.example               # Required environment variables template
├── src/
│   ├── main.tsx               # React entry point
│   ├── app/
│   │   ├── App.tsx            # Root component + screen navigation
│   │   ├── components/
│   │   │   ├── Header.tsx     # Shared navigation header
│   │   │   ├── LandingPage.tsx
│   │   │   ├── SymptomScreen.tsx
│   │   │   ├── AdditionalInfoScreen.tsx
│   │   │   └── ResultScreen.tsx
│   │   └── data/
│   │       └── resultData.ts  # Severity result configurations
│   ├── types/
│   │   └── index.ts           # Shared TypeScript type definitions
│   ├── utils/
│   │   └── gemini.ts          # API client with fallback logic
│   └── styles/
│       ├── index.css          # Style entry point
│       ├── fonts.css          # Google Fonts (Inter, Sora)
│       ├── tailwind.css       # Tailwind CSS config
│       └── theme.css          # Design tokens + CSS variables
├── docs/                      # Screenshots for README
└── public/                    # Static assets (favicon, hero image)
```
=======
- Frontend React with TypeScript  
- Styling Tailwind CSS  
- AI Google Gemini API  
- State Management React Hooks  
>>>>>>> 2811bf93e92463623967c570288e7a4f76479aaf

---

## 💡 Key Design Decisions

<<<<<<< HEAD
- **Instant results first**
  Users see severity immediately without waiting for AI

- **AI as enhancement, not dependency**
  Core experience works even if AI fails (static fallback guidance)

- **Mobile-first UX**
  Sticky CTA and non-blocking flows

- **Cost-aware AI usage**
  Responses are cached and reused across language toggles

- **Server-side API proxy**
  Gemini API key never exposed to the browser

- **Input validation & rate limiting**
  Protects the API endpoint from abuse and malformed requests

---

## 📦 Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- npm 9+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
git clone https://github.com/rithhaikal/caresignals.git
cd caresignals
npm install
```

### Environment Variables

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `PORT` | ❌ | Server port (default: `8080`) |
| `ALLOWED_ORIGINS` | ❌ | Comma-separated CORS origins |

### Development

```bash
# Terminal 1 — Start the backend server
node server.js

# Terminal 2 — Start the Vite dev server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t caresignal .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key caresignal
```
=======
- Instant results first  
  Users see severity immediately without waiting for AI  

- AI as enhancement not dependency  
  The core system works even if AI fails or is unavailable  

- Mobile first UX  
  Designed to reduce scrolling friction with sticky actions  

- Cost aware AI usage  
  AI responses are reused across language toggles to reduce API calls  

- Structured output design  
  AI is constrained to return predictable JSON for reliability  

---

## 🤖 AI Usage Disclosure

This project uses AI assisted tools during development including ChatGPT and Google Gemini.

AI was used to:
- Assist with UI implementation and iteration  
- Help structure and refine prompt design  
- Generate contextual guidance based on symptoms  

The core system design including risk classification logic, UX flow, and decision structure was built manually.

All AI generated outputs are constrained, validated, and integrated into a controlled system. The team understands and can explain all parts of the codebase and architecture.
>>>>>>> 2811bf93e92463623967c570288e7a4f76479aaf

---

## 🧪 Limitations

- Not a medical diagnosis tool
- Uses predefined logic for severity classification
- AI responses may vary depending on input and API performance

---

## ⚠️ Disclaimer

This application is for informational purposes only and does not replace professional medical advice. Always consult a qualified healthcare provider for medical concerns.
