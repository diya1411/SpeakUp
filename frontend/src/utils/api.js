const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const transcribeAudio = async (audioBase64) => {
  const response = await fetch(`${API_BASE_URL}/transcribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioBase64,
      mimeType: 'audio/webm',
    }),
  });

  if (!response.ok) throw new Error('Transcription failed');
  return response.json();
};

export const generateResponse = async (userMessage, scenario, comfortLevel, conversationHistory) => {
  const response = await fetch(`${API_BASE_URL}/generate-response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage,
      scenario,
      comfortLevel,
      conversationHistory,
    }),
  });

  if (!response.ok) throw new Error('Response generation failed');
  return response.json();
};

export const synthesizeSpeech = async (text) => {
  const response = await fetch(`${API_BASE_URL}/synthesize-speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) throw new Error('Speech synthesis failed');
  return response.json();
};

export const saveSession = async (sessionId, scenario, comfortLevel, exchanges, transcript) => {
  const response = await fetch(`${API_BASE_URL}/save-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      scenario,
      comfortLevel,
      exchanges,
      transcript,
    }),
  });

  if (!response.ok) throw new Error('Failed to save session');
  return response.json();
};

export const getSession = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}`);

  if (!response.ok) throw new Error('Failed to retrieve session');
  return response.json();
};
