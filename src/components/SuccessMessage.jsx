import React from 'react';

const SuccessMessage = ({ message }) => {
  return (
    <div className="success-overlay" style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      <div className="notification is-success is-size-4 has-text-weight-bold" style={{
        animation: 'bounce 1s ease-in-out'
      }}>
        <span className="icon is-large mr-2">
          <span style={{ fontSize: '2rem' }}>✅</span>
        </span>
        {message}
      </div>
    </div>
  );
};

export default SuccessMessage;
