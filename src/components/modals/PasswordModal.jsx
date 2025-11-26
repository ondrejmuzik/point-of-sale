import React, { useState, useEffect, useRef } from 'react';

const PasswordModal = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus password field on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await onSubmit(password);

    if (!result.success) {
      setError(result.error);
      setPassword('');
      setIsSubmitting(false);

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
    // If success, the app will re-render and this modal will disappear
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head password-modal-head">
          <h1 className="title is-inline has-text-white has-text-centered">Čertovský svařák&nbsp;2025</h1>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Heslo</label>
            <div className="control">
              <input
                ref={inputRef}
                className={`input ${error ? 'is-danger' : ''}`}
                type="password"
                placeholder="Zadejte heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
              />
            </div>
            {error && (
              <p className="help is-danger mt-2">{error}</p>
            )}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            onClick={handleSubmit}
            className="button has-text-white password-modal-button"
            disabled={isSubmitting || !password}
          >
            {isSubmitting ? 'Přihlašování...' : 'Přihlásit se'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PasswordModal;
