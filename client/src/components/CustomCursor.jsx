import React, { useState, useEffect, useCallback } from 'react';

const CustomCursor = ({ onSiren }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    const handleMouseEnter = () => {
      setHidden(false);
    };

    const handleClick = (e) => {
      if (onSiren) {
        onSiren(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('click', handleClick);
    };
  }, [hidden, onSiren]);

  if (hidden) return null;

  return (
    <div
      className="custom-cursor"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '40px',
        height: '40px',
        zIndex: 100005,
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.05s ease'
      }}
    >
      <i className="fas fa-plus plus-cursor" style={{ fontSize: '40px', color: 'var(--accent-color)', filter: 'drop-shadow(0 0 15px rgba(220, 53, 69, 0.9))' }}></i>
    </div>
  );
};

export default CustomCursor;
