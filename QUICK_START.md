# 🚀 Getting Started - SpeakUp

## What is SpeakUp?

A web app where you practice voice conversations with AI. Pick a scenario, set difficulty (1-5), speak into your mic, and get real-time AI responses with coaching tips.

## 5-Minute Setup

### Step 1: Get API Keys (5 min)

**Google Gemini:**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy it

**ElevenLabs:**
1. Go to https://elevenlabs.io/
2. Sign up or login
3. Profile → Copy API Key
4. Voices → Pick any voice → Copy Voice ID

### Step 2: Clone/Download Project

```bash
git clone <your-repo-url>
cd SpeakUp
```

Or download ZIP and extract

### Step 3: Run Setup Script

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```bash
setup.bat
```

This will:
- Install all dependencies
- Create `.env` files
- Prompt you to add API keys

### Step 4: Add API Keys

**Edit `backend/.env`:**
```
GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
```

### Step 5: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Open App

Open http://localhost:3000 in your browser

## How to Use

1. ✅ Choose a scenario (Job Interview, Friend, Stranger)
2. 🎚️ Set comfort level (1=gentle, 5=realistic pressure)
3. 🎤 Click "Start Conversation"
4. 🎙️ Click microphone and speak
5. 💬 AI responds with text and voice
6. 💡 Get a coaching tip
7. 🔄 Repeat or click "End Session"

## What Each Scenario Does

**💼 Job Interview**
- AI is a professional hiring manager
- Asks follow-up questions
- More challenging at higher comfort levels

**💔 Confronting a Friend**
- AI is emotionally hurt/defensive
- Requires empathy and understanding
- Doesn't back down easily at higher levels

**👋 Talking to a Stranger**
- AI starts awkward, warms up
- Natural conversation practice
- More guarded at higher comfort levels

## Comfort Levels

- **1**: Very gentle and patient. AI gives you space.
- **2**: Supportive but realistic. Less hand-holding.
- **3**: Standard professional/normal mode.
- **4**: More challenging. AI pushes back.
- **5**: Fully realistic. Real pressure and emotion.

## Troubleshooting

### "Microphone not working"
- Check browser permissions (browser might be blocking it)
- Make sure your mic is enabled in system settings
- Try a different browser

### "API Key Error"
- Restart the backend: `npm start` in backend folder
- Double-check you copied the entire key
- Make sure there are no spaces in the key

### "Audio not playing"
- Check your browser volume
- Make sure speakers are plugged in/enabled
- Verify ElevenLabs API key is correct

### "Can't connect to backend"
- Make sure backend is running (`npm start`)
- Check that it says "running on port 5000"
- Try refreshing the browser

## Tips for Best Results

✨ **Recording Quality:**
- Speak clearly and naturally
- Find a quiet space
- Use a decent microphone if possible
- Don't rush - give AI time to respond

💡 **Practice Tips:**
- Start at comfort level 2-3
- Increase comfort level gradually
- Read the coaching tips carefully
- Try different scenarios
- Repeat conversations to improve

🎯 **Each Scenario is Different:**
- Job Interview: Be professional and prepared
- Friend: Be empathetic and genuine
- Stranger: Be friendly but natural

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 👨‍💻 Read [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) to extend the app
- 🌐 Read [DEPLOYMENT_REPLIT.md](DEPLOYMENT_REPLIT.md) to deploy online
- 💬 Save your sessions to track progress

## Deploying to Replit (Make it Public)

1. Go to https://replit.com → Create new project
2. Upload your SpeakUp files
3. Add Secrets (lock icon):
   - GEMINI_API_KEY
   - ELEVENLABS_API_KEY
   - ELEVENLABS_VOICE_ID
4. Run setup commands
5. Click "Share" → Make public
6. Share the link with anyone!

See [DEPLOYMENT_REPLIT.md](DEPLOYMENT_REPLIT.md) for detailed steps.

## Need Help?

- Check the [README.md](README.md) for API documentation
- Check [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for architecture
- Look at browser console for error messages (F12)
- Verify all API keys are correct

---

Enjoy practicing! You got this. 🎯
