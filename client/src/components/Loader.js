import React from 'react';
import '../styles/loader.css';

const Loader = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="loader" style={{ display: isVisible ? 'flex' : 'none' }}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
