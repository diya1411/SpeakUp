import React from 'react';
import { scenarios, comfortDescriptions } from '../utils/scenarios';

export default function ScenarioPicker({
  onScenarioSelect,
  selectedScenario,
  comfortLevel,
  onComfortChange,
}) {
  return (
    <div className="scenario-picker">
      <div>
        <h1 className="scenario-title">SpeakUp</h1>
        <p className="scenario-subtitle">Practice voice conversations with AI</p>
      </div>

      <div className="scenario-cards">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
            onClick={() => onScenarioSelect(scenario.id)}
          >
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
          </div>
        ))}
      </div>

      <div className="comfort-section">
        <label className="comfort-label">
          Comfort Level: <span>{comfortLevel}/5</span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={comfortLevel}
          onChange={(e) => onComfortChange(parseInt(e.target.value))}
          className="comfort-slider"
        />
        <div className="comfort-description">{comfortDescriptions[comfortLevel]}</div>
      </div>

      <button
        className="button button-primary"
        onClick={() => onScenarioSelect(selectedScenario)}
        disabled={!selectedScenario}
      >
        Start Conversation
      </button>
    </div>
  );
}
