import React, { useState, useRef, useEffect } from 'react';
import CoachingTip from './CoachingTip';
import {
  startRecording,
  blobToBase64,
  playAudio,
  checkMicrophonePermission,
} from '../utils/audioUtils';
import {
  transcribeAudio,
  generateResponse,
  synthesizeSpeech,
  saveSession,
} from '../utils/api';
import { scenarios, comfortDescriptions } from '../utils/scenarios';

export default function SessionScreen({ scenario, comfortLevel, onEnd }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coachingTip, setCoachingTip] = useState('');
  const [tipLoading, setTipLoading] = useState(false);
  const [micPermission, setMicPermission] = useState(true);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const sessionIdRef = useRef(Date.now().toString());

  const scenarioData = scenarios.find((s) => s.id === scenario);

  useEffect(() => {
    checkMicrophonePermission().then(setMicPermission);
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMicPermission(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setLoading(true);
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      const audioBase64 = await blobToBase64(audioBlob);

      // Transcribe
      const { transcript: userTranscript } = await transcribeAudio(audioBase64);

      // Add user message to transcript
      const newTranscript = [
        ...transcript,
        { role: 'user', content: userTranscript },
      ];
      setTranscript(newTranscript);

      // Generate AI response
      const { response: aiResponse, coachingTip: tip } = await generateResponse(
        userTranscript,
        scenario,
        comfortLevel,
        newTranscript
      );

      // Add AI message to transcript
      setTranscript([...newTranscript, { role: 'ai', content: aiResponse }]);
      setCoachingTip(tip);
      setTipLoading(false);

      // Synthesize and play AI response
      const { audioBase64: ttsAudio } = await synthesizeSpeech(aiResponse);
      await playAudio(ttsAudio, 'audio/mpeg');

      setLoading(false);
    } catch (error) {
      console.error('Error processing audio:', error);
      setLoading(false);
      alert('Error processing audio. Please try again.');
    }
  };

  const handleEndSession = async () => {
    try {
      await saveSession(
        sessionIdRef.current,
        scenario,
        comfortLevel,
        Math.floor(transcript.length / 2),
        transcript
      );
      onEnd();
    } catch (error) {
      console.error('Error saving session:', error);
      onEnd();
    }
  };

  if (!micPermission) {
    return (
      <div className="session-screen">
        <div className="session-header">
          <div>
            <div className="session-title">Microphone Permission Required</div>
          </div>
        </div>
        <div className="session-content">
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ marginBottom: '20px' }}>
              SpeakUp needs microphone access to record your voice. Please enable microphone
              permissions and refresh the page.
            </p>
            <button className="button button-secondary" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="session-screen">
      <div className="session-header">
        <div>
          <div className="session-title">
            {scenarioData?.title}
          </div>
          <div className="session-info">
            Comfort Level: {comfortLevel}/5 • {comfortDescriptions[comfortLevel]}
          </div>
        </div>
        <button className="button end-button" onClick={handleEndSession}>
          End Session
        </button>
      </div>

      <div className="session-content">
        <div className="transcript-container">
          {transcript.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
              <p>Click the microphone button to start speaking...</p>
            </div>
          ) : (
            transcript.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-label">{msg.role === 'user' ? 'You' : 'AI'}</div>
                <div className="message-text">{msg.content}</div>
                {msg.role === 'ai' && idx === transcript.length - 1 && coachingTip && (
                  <CoachingTip tip={coachingTip} loading={tipLoading} />
                )}
              </div>
            ))
          )}
        </div>

        <div className="mic-control">
          <button
            className={`mic-button ${recording ? 'recording' : ''}`}
            onClick={recording ? handleStopRecording : handleStartRecording}
            disabled={loading}
          >
          </button>
          <div className="mic-status">
            {loading ? (
              <>
                <span className="loading"></span> Processing...
              </>
            ) : recording ? (
              'Recording... Click to stop'
            ) : (
              'Click to record'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
