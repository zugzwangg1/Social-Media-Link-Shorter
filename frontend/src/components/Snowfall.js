import React, { useEffect, useRef } from 'react';
import './Snowfall.css';

const Snowfall = () => {
  const snowfallRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;
    const createInterval = 400; // Create snowflake every 400ms
    
    const createSnowflake = () => {
      if (!snowfallRef.current) return;
      
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.innerHTML = '❄';
      
      // Random horizontal position
      snowflake.style.left = Math.random() * 100 + '%';
      
      // Random animation duration (10-15 seconds for smoother animation)
      const duration = Math.random() * 5 + 10;
      snowflake.style.animationDuration = duration + 's';
      
      // Random size
      const size = Math.random() * 8 + 12;
      snowflake.style.fontSize = size + 'px';
      
      // Random opacity
      snowflake.style.opacity = Math.random() * 0.5 + 0.5;
      
      // Random x offset
      const xOffset = (Math.random() - 0.5) * 60;
      snowflake.style.setProperty('--x-offset', xOffset + 'px');
      
      snowfallRef.current.appendChild(snowflake);
      
      // Remove snowflake after animation completes
      setTimeout(() => {
        if (snowflake && snowflake.parentNode) {
          snowflake.remove();
        }
      }, duration * 1000 + 100);
    };

    // Create initial snowflakes
    for (let i = 0; i < 30; i++) {
      setTimeout(() => createSnowflake(), i * 150);
    }

    // Use requestAnimationFrame for smoother performance
    const animate = (currentTime) => {
      if (currentTime - lastTime >= createInterval) {
        createSnowflake();
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      // Clean up all snowflakes on unmount
      if (snowfallRef.current) {
        snowfallRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={snowfallRef} className="snowfall-container"></div>;
};

export default Snowfall;
