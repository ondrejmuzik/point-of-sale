import React, { useState } from 'react';

const OfflineBanner = ({ pendingCount, isSyncing, onManualSync }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div
        className="offline-banner offline-banner--minimized"
        onClick={() => setIsMinimized(false)}
        title="Klikněte pro zobrazení offline banneru"
      >
        <span className="offline-banner__warning-icon">⚠️</span>
        {pendingCount > 0 && (
          <span className="offline-banner__badge">{pendingCount}</span>
        )}
      </div>
    );
  }

  return (
    <div className="notification is-warning offline-banner">
      <button
        className="offline-banner__close"
        onClick={() => setIsMinimized(true)}
        aria-label="Skrýt"
      >&times;</button>
      <div className="level mb-0">
        <div className="level-left">
          {isSyncing ? (
            <>
              <span className="offline-banner__sync-icon">
                ⟳
              </span>
              <strong>Synchronizace...</strong>
            </>
          ) : (
            <div className="level-item">
              <strong>⚠️ Offline režim</strong>
              {pendingCount > 0 && ` (Operací ve frontě: ${pendingCount})`}
            </div>
          )}
        </div>
        {/* {!isSyncing && pendingCount > 0 && ( */}
          <button
            onClick={onManualSync}
            className="button is-small is-warning is-dark level-right offline-banner__sync-button"
          >
            Synchronizovat
          </button>
        {/* )} */}
      </div>
    </div>
  );
};

export default OfflineBanner;
