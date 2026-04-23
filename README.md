# 🩺 CareSignal

CareSignal is a lightweight symptom checking web app that helps users decide whether to monitor at home, visit a clinic, or seek emergency care based on how they feel.

It uses an AI-driven triage engine, backed by local risk logic, to provide clear and reliable next steps in seconds.

---

## 📸 Screenshots

| Landing Page | Symptom Selection | Result Screen |
|:---:|:---:|:---:|
| <img src="./docs/landing.PNG" width="250" /> | <img src="./docs/symptoms.PNG" width="250" /> | <img src="./docs/result.PNG" width="250" /> |

---

## 🚀 Features

- **AI-Driven Risk Assessment**  
  Gemini analyzes symptoms to instantly determine severity (Safe, Clinic, Emergency)

- **Structured Guidance and Follow up**  
  Generates context-aware next steps, timelines, and supports conversational follow up

- **Multilingual Support**  
  English 🇬🇧 and Bahasa Malaysia 🇲🇾

- **Nearby Care Finder**  
  Opens Google Maps to find nearby clinics or hospitals

---

## ⚡ How It Works

1. **Symptom Input**  
   Users select predefined symptoms or add custom ones  

2. **Risk Evaluation**  
   The AI (with a local fallback) instantly determines the severity  

3. **AI Guidance**  
   Gemini generates structured next steps, timelines, and warning signs  

4. **Language Toggle**  
   Users can switch between English and Bahasa Malaysia without regenerating core results  

---

## 🌍 Problem and Impact

Many users are unsure whether their symptoms require urgent care or can be safely monitored at home. This leads to panic, delayed treatment, or unnecessary hospital visits.

CareSignal reduces uncertainty by providing immediate risk assessment and clear next step guidance in seconds.

---

## 🏗️ Architecture and Tech Stack

CareSignal uses a simple and scalable client server model:

- **Frontend**  
  React 19, TypeScript, Vite, Tailwind CSS  
  Handles UI, symptom flow, and rule based severity logic  

- **Backend**  
  Express.js  
  Acts as a secure proxy for Gemini API and serves production build  

- **AI Engine**  
  Google Gemini  
  Generates structured JSON guidance based on user input  

---

## 🧠 Key Design Decisions

- **AI-driven triage first**  
  Gemini is used as the core decision engine for highly accurate severity assessment  

- **Robust local fallback**  
  The core experience relies on a local rule-based system if the AI API fails  

- **Mobile first UX**  
  Designed with sticky actions and low friction flows  

- **Cost aware AI usage**  
  Responses are reused across language toggles to reduce API calls  

- **Structured AI output**  
  AI is constrained to return predictable JSON for reliability  

---

## 🤖 AI Usage Disclosure

This project uses AI tools including ChatGPT and Google Gemini.

AI was used to:
- Assist with UI implementation and iteration  
- Help refine prompt structure  
- Generate structured health guidance based on user input  

The core system design including:
- Risk classification logic  
- User flow and interaction design  
- Decision making structure  

was designed and implemented manually.

All AI outputs are constrained, validated, and integrated into a controlled system. The team is able to explain and justify all parts of the codebase during evaluation.

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
