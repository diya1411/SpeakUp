# SpeakUp - Voice Conversation Practice App

A full-stack web application for practicing voice conversations with AI. Get real-time feedback from Gemini AI with different scenario personas and customize difficulty with a comfort dial.

## Features

✨ **Voice Conversation Loop**
- Speak into your microphone
- AI transcribes using Google Gemini (with audio input support)
- Scenario-specific AI responses with personality
- Text-to-speech playback via ElevenLabs

🎭 **Three Scenarios**
1. **Job Interview** - Practice with a professional hiring manager
2. **Confronting a Friend** - Difficult emotional conversation
3. **Talking to a Stranger** - Build natural conversation skills

📊 **Comfort Dial (1-5)**
- Level 1: Gentle and patient AI
- Level 2: Supportive but realistic
- Level 3: Standard and balanced
- Level 4: More challenging
- Level 5: Fully realistic pressure

💡 **Coaching Tips**
- One-sentence tips after each AI response
- Focus on pacing, clarity, tone, and communication skills

## Project Structure

```
SpeakUp/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ScenarioPicker.jsx
    │   │   ├── SessionScreen.jsx
    │   │   └── CoachingTip.jsx
    │   ├── utils/
    │   │   ├── audioUtils.js
    │   │   ├── scenarios.js
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## Quick Start

### Prerequisites
- Node.js 16+
- Google Gemini API key
- ElevenLabs API key and voice ID

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your API keys to .env
npm start
```

### Frontend Setup (in new terminal)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

## API Keys

### Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create API key

### ElevenLabs TTS
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Copy API key from Profile
3. Copy Voice ID from Voices

## API Endpoints

- `POST /api/transcribe` - Transcribe audio
- `POST /api/generate-response` - Generate AI response
- `POST /api/synthesize-speech` - Text to speech
- `POST /api/save-session` - Save session
- `GET /api/session/:sessionId` - Retrieve session

## Deployment to Replit

1. Upload files to Replit
2. Add secrets: `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`
3. Backend: `cd backend && npm install && npm start`
4. Frontend: `cd frontend && npm install && npm run dev`
5. Make public via Share button

## Tech Stack

**Frontend:** React 18, Vite, Web Audio API
**Backend:** Node.js, Express, Google Generative AI, ElevenLabs API

## UI Features

- Clean minimal design with white background
- Mobile responsive
- Pulsing mic indicator
- Session persistence
- Coaching tips after each response
- Comfort level slider (1-5)

## Troubleshooting

- **Microphone error:** Check browser permissions
- **API key errors:** Verify `.env` configuration
- **Audio issues:** Check browser volume
- **CORS errors:** Backend is already configured for localhost/Replit

## Future Enhancements

- [ ] Session history and playback
- [ ] Language support
- [ ] More scenario types
- [ ] Progress tracking

## License

MIT