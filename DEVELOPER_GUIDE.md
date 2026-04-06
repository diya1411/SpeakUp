# SpeakUp Developer Guide

## Project Architecture

```
┌─────────────────┐
│   Browser UI    │ (React + Vite)
│ ScenarioPicker  │
│ SessionScreen   │
└────────┬────────┘
         │ Fetch API
         │ (JSON + Base64 audio)
         ↓
┌─────────────────────────────┐
│    Express Backend          │
├─────────────────────────────┤
│ • Audio Transcription (API) │
│ • Response Generation (API) │
│ • Speech Synthesis (API)    │
│ • Session Storage (Memory)  │
└────────┬────────────────────┘
         │
    ┌────┴─────┬──────────────────┐
    ↓          ↓                  ↓
 Gemini    ElevenLabs         Session
 API       API                Storage
```

## Core Components

### Frontend Components

**ScenarioPicker.jsx**
- Displays 3 scenario cards
- Comfort dial slider (1-5)
- Start button
- Transitions to SessionScreen

**SessionScreen.jsx**
- Microphone recording interface
- Real-time transcript display
- AI response handling
- Loading states
- Coaching tips integration
- End session button

**CoachingTip.jsx**
- Shows actionable feedback
- Loading state with spinner
- Positioned below AI messages

### Backend Routes

**POST /api/transcribe**
```javascript
// Input
{
  audioBase64: "base64-encoded-audio",
  mimeType: "audio/webm"
}
// Output
{
  transcript: "user's spoken text"
}
```

**POST /api/generate-response**
```javascript
// Input
{
  userMessage: "user's text",
  scenario: "job-interview",
  comfortLevel: 3,
  conversationHistory: [
    { role: "user", content: "..." },
    { role: "ai", content: "..." }
  ]
}
// Output
{
  response: "ai's response text",
  coachingTip: "actionable tip"
}
```

**POST /api/synthesize-speech**
```javascript
// Input
{
  text: "ai's response to convert to speech"
}
// Output
{
  audioBase64: "base64-encoded-audio",
  mimeType: "audio/mpeg"
}
```

## Data Flow

### Conversation Loop

1. **User Recording**
   - Click mic button → starts recording
   - Browser uses Web Audio API
   - Records in WebRTC/WebM format

2. **Transcription**
   - Audio blob → Base64 encode
   - Send to `/api/transcribe`
   - Gemini processes and returns text

3. **AI Response**
   - Send user text + conversation history to `/api/generate-response`
   - Gemini generates response with scenario context
   - Backend generates coaching tip
   - Return both to frontend

4. **Text-to-Speech**
   - Send AI response text to `/api/synthesize-speech`
   - ElevenLabs converts to audio
   - Return Base64-encoded audio

5. **Playback**
   - Decode Base64 audio
   - Create Blob and object URL
   - Play using HTML Audio element
   - Auto-stop after playback

6. **Session Storage**
   - On end session, save via `/api/save-session`
   - All messages stored with metadata

## Configuration

### Environment Variables

**Backend (.env)**
```
GEMINI_API_KEY=sk-...          # Google Gemini API key
ELEVENLABS_API_KEY=...          # ElevenLabs API key
ELEVENLABS_VOICE_ID=nPczCjz... # Voice ID from ElevenLabs
PORT=5000                       # Server port
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Scenario Prompts

Located in `backend/server.js` in `scenarioPrompts` object:

```javascript
const scenarioPrompts = {
  'job-interview': (comfortLevel) => { ... },
  'confronting-friend': (comfortLevel) => { ... },
  'talking-to-stranger': (comfortLevel) => { ... },
}
```

Each prompt:
- Defines AI personality
- Includes comfort level (1-5) instructions
- Specifies response length and tone

## Extending the App

### Adding a New Scenario

1. **Add to scenarios.js:**
```javascript
{
  id: 'new-scenario',
  title: 'Scenario Title',
  description: 'Description',
  icon: '🎭'
}
```

2. **Add system prompt in server.js:**
```javascript
'new-scenario': (comfortLevel) => `
  You are ... [describe AI personality]
  Comfort Level ${comfortLevel}/5:
  - Level 1: ...
  - Level 5: ...
`
```

### Adding Features

**Recording more data:**
- Modify `MessageScreen.jsx` component
- Add fields to `/api/save-session`
- Update session storage structure

**Custom voices:**
- Add voice selector dropdown
- Pass voice ID as query param to `/api/synthesize-speech`
- Update ElevenLabs voice lookup

**Session analytics:**
- Add `/api/sessions` endpoint to list all sessions
- Add session history screen
- Calculate metrics (duration, exchanges, etc.)

## Performance Optimization

### Current Optimizations
- ✅ Audio compressed to WebM format
- ✅ Streaming API responses
- ✅ Base64 encoding for cross-network audio
- ✅ CSS animations use transforms (GPU-accelerated)

### Future Optimizations
- Add audio compression before sending
- Implement caching for coaching tips
- Lazy load scenario descriptions
- Service Worker for offline support
- Code splitting by scenario

## Security Considerations

### Current Implementation
- ✅ API keys never exposed in frontend
- ✅ All API calls go through backend
- ✅ CORS configured for allowed origins
- ✅ Input validation on backend

### Recommendations
- Rate limit API endpoints
- Add authentication for session persistence
- Validate audio file size/type
- Implement HTTPS only
- Add CSP headers

## Testing

### Manual Testing Checklist

- [ ] Microphone permission prompts correctly
- [ ] Recording stops after user releases button
- [ ] Transcription displays accurately
- [ ] Comfort level changes AI tone
- [ ] Coaching tips are contextual
- [ ] Audio plays and continues automatically
- [ ] Sessions save on end
- [ ] Mobile responsive on different screens
- [ ] Works on different browsers
- [ ] API errors handled gracefully

### Unit Tests (Frontend)

```javascript
// Example test structure
describe('ScenarioPicker', () => {
  test('selects scenario on click', () => { ... });
  test('updates comfort level on slider change', () => { ... });
});
```

## Debugging

### Common Issues

**Audio not recording:**
- Check mic permission in browser settings
- Verify mic is working in system settings
- Try different browser
- Check browser console for errors

**API calls failing:**
- Verify backend is running
- Check CORS settings
- Verify API keys in .env
- Look at network tab in DevTools

**UI not updating:**
- Check React dev tools
- Verify state changes
- look for console errors
- Check network requests

### Debug Tools

- Browser DevTools (F12)
- React DevTools extension
- Network tab for API calls
- Console for errors
- Backend logs in terminal

## Deployment Checklist

- [ ] .env files created with real API keys
- [ ] Environment variables verified
- [ ] npm dependencies installed
- [ ] Frontend build runs without errors
- [ ] Backend starts without errors
- [ ] Microphone works
- [ ] All three scenarios work
- [ ] Coaching tips generate
- [ ] TTS audio plays
- [ ] Sessions save
- [ ] Mobile UI works
- [ ] No console errors
- [ ] Performance acceptable

## Resources

- [Google Gemini API Docs](https://ai.google.dev/)
- [ElevenLabs API Docs](https://elevenlabs.io/docs)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)

---

Happy coding! 🚀
