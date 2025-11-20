import React from 'react';
import Snowfall from './Snowfall';
import './SpaceBackground.css';

const SpaceBackground = ({ children }) => {
  return (
    <div className="space-background">
      <Snowfall />
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default SpaceBackground;
