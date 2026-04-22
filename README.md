# 🩺 CareSignal

CareSignal is a lightweight symptom-checking web app that helps users decide what to do next based on how they feel — whether to monitor at home, visit a clinic, or seek emergency care.

It combines simple rule-based logic with AI-generated guidance to provide clear, actionable next steps in seconds.

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

- Select symptoms from a predefined list  
- Add custom symptoms manually  
- Instant risk assessment (Safe, Clinic, Emergency)  
- AI-generated guidance for next 24 hours  
- Warning signs and escalation triggers  
- English 🇬🇧 / Bahasa Malaysia 🇲🇾 support  
- Find nearby clinics or hospitals via Google Maps  

---

## ⚡ How It Works

1. **Symptom Input**  
   Users select predefined symptoms or add their own  

2. **Risk Evaluation**  
   A rule-based system determines severity instantly  

3. **AI Guidance**  
   Gemini generates structured next steps, timelines, and warning signs  

4. **Language Toggle**  
   Users can switch between English and Bahasa Malaysia  

---

## 🧠 Tech Stack

- **Frontend**: React + TypeScript  
- **Styling**: Tailwind CSS  
- **AI**: Google Gemini API  
- **State Management**: React Hooks  

---

## 💡 Key Design Decisions

- **Instant results first**  
  Users see severity immediately without waiting for AI  

- **AI as enhancement, not dependency**  
  Core experience works even if AI fails  

- **Mobile-first UX**  
  Sticky CTA and non-blocking flows  

- **Cost-aware AI usage**  
  Responses are cached and reused across language toggles  

---

## 🧪 Limitations

- Not a medical diagnosis tool  
- Uses predefined logic for severity classification  
- AI responses may vary depending on input and API performance  

---

## ⚠️ Disclaimer

This application is for informational purposes only and does not replace professional medical advice. Always consult a qualified healthcare provider for medical concerns.

---

## 📦 Setup

```bash
npm install
npm run dev
