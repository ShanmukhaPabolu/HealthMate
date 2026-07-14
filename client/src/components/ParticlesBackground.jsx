import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 8 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      const colors = [
        'rgba(220, 53, 69, 0.7)', // Red
        'rgba(0, 123, 255, 0.7)',  // Blue
        'rgba(40, 167, 69, 0.7)',  // Green
        'rgba(111, 66, 193, 0.7)'  // Purple
      ];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      particle.style.position = 'absolute';
      particle.style.opacity = '0.3';
      particle.style.pointerEvents = 'none';

      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      const duration = Math.random() * 15 + 10;
      particle.style.animationName = 'float-particle';
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationTimingFunction = 'linear';
      particle.style.animationIterationCount = 'infinite';
      particle.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(particle);

      setTimeout(() => {
        if (container.contains(particle)) {
          particle.remove();
        }
      }, duration * 1000);
    };

    // Initialize 30 particles
    for (let i = 0; i < 30; i++) {
      setTimeout(createParticle, i * 150);
    }

    const interval = setInterval(createParticle, 500);

    return () => {
      clearInterval(interval);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      className="particles-container"
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden'
      }}
    />
  );
};

export default ParticlesBackground;
