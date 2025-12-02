import React from 'react';

const OfflineBanner = ({ pendingCount, isSyncing, onManualSync }) => {
  return (
    <div className="notification is-warning offline-banner">
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
              <span className="offline-banner__warning-icon">⚠️</span>
              <strong>Offline režim</strong>
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
