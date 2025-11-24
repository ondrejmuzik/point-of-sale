import React from 'react';

const ConfirmModal = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onCancel}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-warning">
          <p className="modal-card-title">
            Potvrzení
          </p>
          <button className="delete" aria-label="close" onClick={onCancel}></button>
        </header>
        <section className="modal-card-body">
          <p className="is-size-5">{message}</p>
        </section>
        <footer className="buttons modal-card-foot">
          <button onClick={onConfirm} className="button is-danger has-text-white">Potvrdit</button>
          <button onClick={onCancel} className="button">Zpět</button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;
