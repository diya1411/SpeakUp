import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Session storage (simulated - can be replaced with Replit KV store)
const sessions = {};

// System prompts for each scenario
const scenarioPrompts = {
  'job-interview': (comfortLevel) => `You are a professional senior hiring manager conducting a job interview. Your role is to evaluate candidates professionally and thoroughly.

Comfort Level ${comfortLevel}/5:
- Level 1: Be gentle, encouraging, and give the candidate plenty of space to think.
- Level 2: Professional but supportive.
- Level 3: Professional and standard - ask probing follow-up questions.
- Level 4: Demanding - challenge answers, dig deeper.
- Level 5: Tough interviewer - skeptical, challenging, realistic pressure. Point out gaps.

Keep responses concise (1-2 sentences). Ask one follow-up question or observation. Be evaluative.`,

  'confronting-friend': (comfortLevel) => `You are a close friend who has been hurt by something the user did. You're upset and need to talk about it.

Comfort Level ${comfortLevel}/5:
- Level 1: You're hurt but gentle - you'll listen and try to understand.
- Level 2: You're hurt but willing to talk it through.
- Level 3: You're genuinely upset and defensive - you need acknowledgment first.
- Level 4: You're frustrated and stand your ground - you don't back down easily.
- Level 5: You're genuinely angry and realistic - you might not forgive immediately. This is serious.

Keep responses concise but emotional and authentic. React naturally. Don't give up your position easily unless the user really addresses your concerns.`,

  'talking-to-stranger': (comfortLevel) => `You are a friendly stranger open to conversation but a bit awkward at first. Over time, you warm up and become more natural. You're interested but cautious.

Comfort Level ${comfortLevel}/5:
- Level 1: You're very shy and reserved - take time to warm up, ask gentle questions.
- Level 2: You're friendly but cautious - warming up gradually.
- Level 3: Moderately friendly and a bit awkward - you're opening up.
- Level 4: Friendly and engaging - you're warmed up and comfortable.
- Level 5: Natural and realistic - you're comfortable but still a bit guarded. You share but carefully.

Keep responses concise (1-2 sentences). Gradually become more engaging and natural. React to what they say.`,
};

// Helper: Get coaching tip based on conversation
async function getCoachingTip(scenario, userMessage, aiResponse, comfortLevel) {
  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Based on this conversation exchange:
User: "${userMessage}"
AI (${scenario}): "${aiResponse}"

Generate ONE short coaching tip (max 10 words) about communication skills. Focus on: tone, pacing, clarity, confidence, or listening. 
Return ONLY the tip text, nothing else.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error('Error generating coaching tip:', error);
    return 'Keep it conversational and authentic.';
  }
}

// Route: Transcribe audio using Deepgram REST API
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'No audio data provided' });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    // Transcribe using Deepgram REST API
    const response = await axios.post(
      'https://api.deepgram.com/v1/listen?model=nova-2&language=en',
      audioBuffer,
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': mimeType,
        },
      }
    );

    const transcript = response.data?.results?.channels[0]?.alternatives[0]?.transcript || '';

    if (!transcript) {
      return res.status(400).json({ error: 'No speech detected' });
    }

    res.json({ transcript });
  } catch (error) {
    console.error('Transcription error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

// Route: Generate AI response
app.post('/api/generate-response', async (req, res) => {
  try {
    const { userMessage, scenario, comfortLevel, conversationHistory = [] } =
      req.body;

    if (!userMessage || !scenario || comfortLevel === undefined) {
      return res
        .status(400)
        .json({ error: 'Missing required fields' });
    }

    const systemPrompt = scenarioPrompts[scenario](comfortLevel);
    const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Build conversation context
    let conversationContext = systemPrompt + '\n\nConversation so far:\n';
    conversationHistory.forEach((msg) => {
      conversationContext += `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}\n`;
    });

    const result = await model.generateContent(
      conversationContext + `User: ${userMessage}\nAI Response (keep to 1-2 sentences):`
    );

    const aiResponse = result.response.text().trim();

    // Generate coaching tip
    const coachingTip = await getCoachingTip(
      scenario,
      userMessage,
      aiResponse,
      comfortLevel
    );

    res.json({ response: aiResponse, coachingTip });
  } catch (error) {
    console.error('Response generation error:', error);
    res.status(500).json({ error: 'Response generation failed' });
  }
});

// Route: Synthesize speech using ElevenLabs
app.post('/api/synthesize-speech', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'nPczCjzI2devNBz1zQrH'; // Default voice ID

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      { text, model_id: 'eleven_monolingual_v1' },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const audioBase64 = Buffer.from(response.data).toString('base64');

    res.json({ audioBase64, mimeType: 'audio/mpeg' });
  } catch (error) {
    console.error('TTS error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Text-to-speech synthesis failed' });
  }
});

// Route: Save session
app.post('/api/save-session', (req, res) => {
  try {
    const { sessionId, scenario, comfortLevel, exchanges, transcript } =
      req.body;

    if (!sessionId || !scenario) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    sessions[sessionId] = {
      scenario,
      comfortLevel,
      exchanges,
      transcript,
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, sessionId });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Route: Get session
app.get('/api/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions[sessionId];

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve the frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route: serve index.html for all non-API routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SpeakUp backend running on port ${PORT}`);
});
