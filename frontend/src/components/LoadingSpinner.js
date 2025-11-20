import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner">
        <div className="orbit"></div>
        <div className="orbit"></div>
        <div className="orbit"></div>
        <div className="planet"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
