import React, { useState, useRef, useEffect } from 'react';
import { hashPassword } from '../../utils/crypto';
import { APP_PASSWORD_HASH } from '../../constants/auth';
import { generateOrdersCSV, downloadCSV, generateCSVFilename } from '../../utils/csvExport';

// 5-step state machine for purge workflow
const STEPS = {
  PASSWORD_ENTRY: 'PASSWORD_ENTRY',
  CONFIRMATION: 'CONFIRMATION',
  AUTO_EXPORT: 'AUTO_EXPORT',
  PURGING: 'PURGING',
  SUCCESS: 'SUCCESS'
};

const PurgeConfirmModal = ({ orders, onClose, purgeAllOrders, resetOrderNumber }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.PASSWORD_ENTRY);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [error, setError] = useState('');
  const [exportedFilename, setExportedFilename] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const passwordInputRef = useRef(null);

  // Auto-focus password field on mount
  useEffect(() => {
    if (currentStep === STEPS.PASSWORD_ENTRY && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [currentStep]);

  // Step 1: Password entry and validation
  const handlePasswordSubmit = async () => {
    setIsProcessing(true);
    setPasswordError('');

    try {
      const hashedPassword = await hashPassword(password);

      if (hashedPassword === APP_PASSWORD_HASH) {
        // Password correct, move to confirmation
        setCurrentStep(STEPS.CONFIRMATION);
      } else {
        setPasswordError('Nesprávné heslo');
        setPassword('');

        // Clear error after 3 seconds
        setTimeout(() => {
          setPasswordError('');
        }, 3000);
      }
    } catch (err) {
      setPasswordError('Chyba při ověřování hesla');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Confirmation with checkbox
  const handleConfirm = async () => {
    if (!understood) return;

    setIsProcessing(true);
    setCurrentStep(STEPS.AUTO_EXPORT);

    // Step 3: Auto-export
    try {
      const csvContent = generateOrdersCSV(orders);
      const filename = generateCSVFilename();
      downloadCSV(csvContent, filename);
      setExportedFilename(filename);

      // Small delay to ensure download started
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Purge database
      setCurrentStep(STEPS.PURGING);

      const purgeResult = await purgeAllOrders();
      if (!purgeResult.success) {
        throw new Error(purgeResult.error || 'Nepodařilo se vymazat databázi');
      }

      const resetResult = await resetOrderNumber();
      if (!resetResult.success) {
        throw new Error(resetResult.error || 'Nepodařilo se resetovat číslo objednávky');
      }

      // Step 5: Success
      setCurrentStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message || 'Došlo k chybě při mazání databáze');
      setIsProcessing(false);
    }
  };

  // Retry purge if it failed after export
  const handleRetryPurge = async () => {
    setError('');
    setIsProcessing(true);
    setCurrentStep(STEPS.PURGING);

    try {
      const purgeResult = await purgeAllOrders();
      if (!purgeResult.success) {
        throw new Error(purgeResult.error || 'Nepodařilo se vymazat databázi');
      }

      const resetResult = await resetOrderNumber();
      if (!resetResult.success) {
        throw new Error(resetResult.error || 'Nepodařilo se resetovat číslo objednávky');
      }

      setCurrentStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message || 'Došlo k chybě při mazání databáze');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle close with confirmation
  const handleClose = () => {
    if (currentStep === STEPS.SUCCESS) {
      onClose();
    } else if (currentStep === STEPS.AUTO_EXPORT || currentStep === STEPS.PURGING) {
      // Don't allow closing during processing
      return;
    } else {
      onClose();
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-card">
        <header className="modal-card-head password-modal-head">
          <p className="modal-card-title has-text-white">
            {currentStep === STEPS.PASSWORD_ENTRY && 'Vymazat databázi'}
            {currentStep === STEPS.CONFIRMATION && 'Potvrzení vymazání'}
            {currentStep === STEPS.AUTO_EXPORT && 'Exportuji data...'}
            {currentStep === STEPS.PURGING && 'Mažu databázi...'}
            {currentStep === STEPS.SUCCESS && 'Hotovo!'}
          </p>
          {currentStep !== STEPS.AUTO_EXPORT && currentStep !== STEPS.PURGING && (
            <button
              className="delete"
              aria-label="close"
              onClick={handleClose}
            ></button>
          )}
        </header>

        <section className="modal-card-body">
          {/* Step 1: Password Entry */}
          {currentStep === STEPS.PASSWORD_ENTRY && (
            <div>
              <p className="mb-4">
                Pro potvrzení zadejte heslo:
              </p>
              <div className="field">
                <div className="control">
                  <input
                    ref={passwordInputRef}
                    className={`input ${passwordError ? 'is-danger' : ''}`}
                    type="password"
                    placeholder="Heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    disabled={isProcessing}
                  />
                </div>
                {passwordError && (
                  <p className="help is-danger mt-2">{passwordError}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {currentStep === STEPS.CONFIRMATION && (
            <div>
              <div className="notification is-warning mb-4">
                <p className="mb-3">
                  <strong>Upozornění:</strong> Tato akce trvale vymaže všechny objednávky
                  z databáze a resetuje číslování na 1.
                </p>
                <p>
                  Data budou před vymazáním automaticky exportována do CSV souboru.
                </p>
              </div>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                />
                <span className="ml-2">Rozumím, že tato akce je nevratná</span>
              </label>
            </div>
          )}

          {/* Step 3: Auto Export */}
          {currentStep === STEPS.AUTO_EXPORT && (
            <div className="has-text-centered">
              <div className="mb-4">
                <span className="icon is-large has-text-info">
                  <i className="fas fa-download fa-3x"></i>
                </span>
              </div>
              <p className="mb-2">Exportuji data před vymazáním...</p>
              <progress className="progress is-info" max="100"></progress>
            </div>
          )}

          {/* Step 4: Purging */}
          {currentStep === STEPS.PURGING && (
            <div>
              {error ? (
                <div>
                  <div className="notification is-danger mb-4">
                    <p className="mb-3">
                      <strong>Chyba:</strong> {error}
                    </p>
                    <p>
                      Data byla exportována do souboru <strong>{exportedFilename}</strong>.
                      Můžete zkusit vymazání znovu nebo zrušit operaci.
                    </p>
                  </div>
                  <div className="buttons">
                    <button
                      onClick={handleRetryPurge}
                      className="button is-danger"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Zkouším znovu...' : 'Zkusit znovu'}
                    </button>
                    <button
                      onClick={handleClose}
                      className="button"
                      disabled={isProcessing}
                    >
                      Zrušit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="has-text-centered">
                  <div className="mb-4">
                    <span className="icon is-large has-text-danger">
                      <i className="fas fa-trash fa-3x"></i>
                    </span>
                  </div>
                  <p className="mb-2">Mažu všechny objednávky...</p>
                  <progress className="progress is-danger" max="100"></progress>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === STEPS.SUCCESS && (
            <div className="has-text-centered">
              <div className="mb-4">
                <span className="icon is-large has-text-success">
                  <i className="fas fa-check-circle fa-3x"></i>
                </span>
              </div>
              <p className="mb-4 is-size-5">
                <strong>Databáze byla úspěšně vymazána!</strong>
              </p>
              <div className="notification is-success is-light">
                <p className="mb-2">
                  ✓ Data exportována: <strong>{exportedFilename}</strong>
                </p>
                <p className="mb-2">
                  ✓ Všechny objednávky vymazány
                </p>
                <p>
                  ✓ Číslo objednávky resetováno na 1
                </p>
              </div>
            </div>
          )}
        </section>

        <footer className="modal-card-foot buttons">
          {/* Step 1: Password Entry */}
          {currentStep === STEPS.PASSWORD_ENTRY && (
            <>
              <button
                onClick={handlePasswordSubmit}
                className="button is-danger"
                disabled={isProcessing || !password}
              >
                {isProcessing ? 'Ověřuji...' : 'Pokračovat'}
              </button>
              <button onClick={handleClose} className="button">
                Zrušit
              </button>
            </>
          )}

          {/* Step 2: Confirmation */}
          {currentStep === STEPS.CONFIRMATION && (
            <>
              <button
                onClick={handleConfirm}
                className="button is-danger"
                disabled={!understood || isProcessing}
              >
                Potvrdit vymazání
              </button>
              <button onClick={handleClose} className="button">
                Zrušit
              </button>
            </>
          )}

          {/* Step 5: Success */}
          {currentStep === STEPS.SUCCESS && (
            <button onClick={handleClose} className="button is-success">
              Zavřít
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default PurgeConfirmModal;
