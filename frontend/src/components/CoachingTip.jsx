import React from 'react';

export default function CoachingTip({ tip, loading }) {
  if (!tip && !loading) return null;

  return (
    <div className="coaching-tip">
      <div className="coaching-tip-label">💡 Coaching Tip</div>
      <div className="coaching-tip-text">
        {loading ? <span className="loading"></span> : tip}
      </div>
    </div>
  );
}
