import React, { useState } from 'react';
import ScenarioPicker from './components/ScenarioPicker';
import SessionScreen from './components/SessionScreen';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('picker'); // 'picker' or 'session'
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [comfortLevel, setComfortLevel] = useState(3);

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setScreen('session');
  };

  const handleEndSession = () => {
    setScreen('picker');
    setSelectedScenario(null);
  };

  return (
    <div className="app">
      {screen === 'picker' ? (
        <ScenarioPicker
          onScenarioSelect={handleScenarioSelect}
          selectedScenario={selectedScenario}
          comfortLevel={comfortLevel}
          onComfortChange={setComfortLevel}
        />
      ) : (
        <SessionScreen
          scenario={selectedScenario}
          comfortLevel={comfortLevel}
          onEnd={handleEndSession}
        />
      )}
    </div>
  );
}
