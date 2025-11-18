import React from 'react';

const ConfirmModal = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onCancel}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-warning">
          <p className="modal-card-title">
            <span className="icon is-large mr-2">
              <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            </span>
            Confirm Action
          </p>
          <button className="delete" aria-label="close" onClick={onCancel}></button>
        </header>
        <section className="modal-card-body">
          <p className="is-size-5">{message}</p>
        </section>
        <footer className="modal-card-foot">
          <button onClick={onConfirm} className="button is-danger">Confirm</button>
          <button onClick={onCancel} className="button">Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;
