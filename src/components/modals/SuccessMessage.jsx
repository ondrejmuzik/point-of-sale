import React from 'react';

const SuccessMessage = ({ message }) => {
  return (
    <div className="success-overlay">
      <div className="notification is-success is-size-5 has-text-weight-bold">
        {message}
      </div>
    </div>
  );
};

export default SuccessMessage;
