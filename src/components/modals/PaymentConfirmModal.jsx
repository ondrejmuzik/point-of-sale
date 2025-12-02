import React, { useEffect } from 'react';

const PaymentConfirmModal = ({ amount, onCancel, onConfirm, message = 'Přijali jste platbu?' }) => {
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onConfirm, onCancel]);

  // Determine if amount is negative
  const amountValue = parseFloat(amount);
  const isNegative = amountValue < 0;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onCancel}></div>
      <div className="modal-card">
        <header className="modal-card-head has-background-warning">
          <p className="modal-card-title">
            Potvrzení platby
          </p>
          <button className="delete" aria-label="close" onClick={onCancel}></button>
        </header>
        <section className="modal-card-body has-text-centered">
          <p className="is-size-5 mb-5">{message}</p>
          <p className={`is-size-1 has-text-weight-bold ${isNegative ? 'has-text-danger' : 'has-text-success'}`}>
            {amount},-
          </p>
        </section>
        <footer className="modal-card-foot" style={{ display: 'block' }}>
          <button
            onClick={onConfirm}
            className="button is-success is-large has-text-white is-fullwidth mb-3"
          >
            Ano, přijato
          </button>
          <button
            onClick={onCancel}
            className="button is-light is-fullwidth"
          >
            Zpět
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PaymentConfirmModal;
