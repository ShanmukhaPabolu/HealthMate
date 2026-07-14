import React from 'react';

const SirenEffectContainer = ({ sirenEvents }) => {
  return (
    <div
      className="siren-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100000
      }}
    >
      {sirenEvents.map((event) => (
        <div
          key={event.id}
          className="siren-effect"
          style={{
            position: 'absolute',
            left: `${event.x}px`,
            top: `${event.y}px`,
            borderRadius: '50%',
            border: '3px solid var(--accent-color)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            animation: 'siren-pulse 1s ease-out forwards',
            boxShadow: '0 0 20px rgba(220, 53, 69, 0.8)'
          }}
        />
      ))}
    </div>
  );
};

export default SirenEffectContainer;
