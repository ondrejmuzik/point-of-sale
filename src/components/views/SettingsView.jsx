import React, { useState } from 'react';
import { generateOrdersCSV, downloadCSV, generateCSVFilename, filterOrdersByDateRange } from '../../utils/csvExport';
import PurgeConfirmModal from '../modals/PurgeConfirmModal';

const SettingsView = ({
  orders,
  getOrdersForExport,
  purgeAllOrders,
  resetOrderNumber,
  onLogout
}) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  // Get filtered order count
  const getFilteredCount = () => {
    if (!dateFrom && !dateTo) {
      return orders.length;
    }
    return filterOrdersByDateRange(orders, dateFrom, dateTo).length;
  };

  // Export all orders
  const handleExportAll = () => {
    const allOrders = getOrdersForExport();
    const csvContent = generateOrdersCSV(allOrders);
    const filename = generateCSVFilename();
    downloadCSV(csvContent, filename);
  };

  // Export filtered orders
  const handleExportFiltered = () => {
    const allOrders = getOrdersForExport();
    const csvContent = generateOrdersCSV(allOrders, {
      dateFrom,
      dateTo
    });
    const filename = generateCSVFilename();
    downloadCSV(csvContent, filename);
  };

  const filteredCount = getFilteredCount();
  const hasFilters = dateFrom || dateTo;

  return (
    <div className="container" style={{ marginTop: '2rem', paddingBottom: '2rem' }}>
      <div className="columns is-centered">
        <div className="column is-12-mobile is-10-tablet is-8-desktop">
          <h1 className="title is-3 has-text-centered mb-5">Nastavení</h1>

          {/* App Info Section */}
          <div className="box mb-5">
            <h2 className="title is-5 mb-4">Informace o aplikaci</h2>

            <table className="table is-fullwidth">
              <tbody>
                <tr>
                  <td><strong>Název aplikace</strong></td>
                  <td>Čertovský svařák POS</td>
                </tr>
                <tr>
                  <td><strong>Verze</strong></td>
                  <td>0.9.0</td>
                </tr>
                <tr>
                  <td><strong>Stav databáze</strong></td>
                  <td>
                    <span className="tag is-success">Připojeno</span>
                  </td>
                </tr>
                {/* <tr>
                  <td><strong>Celkem objednávek</strong></td>
                  <td>{orders.length}</td>
                </tr> */}
              </tbody>
            </table>
          </div>

          {/* Export Section */}
          <div className="box mb-5">
            <h2 className="title is-5 mb-4">Export objednávek</h2>

            <div className="columns is-multiline mb-4">
              <div className="column is-half">
                <label className="label">Od data</label>
                <input
                  type="date"
                  className="input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="column is-half">
                <label className="label">Do data</label>
                <input
                  type="date"
                  className="input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            {hasFilters && (
              <p className="mb-3 has-text-grey">
                Filtrované objednávky: <strong>{filteredCount}</strong>
              </p>
            )}

            <div className="buttons">
              <button
                onClick={handleExportAll}
                className="button is-primary"
                disabled={orders.length === 0}
              >
                Exportovat vše ({orders.length})
              </button>
              {hasFilters && (
                <button
                  onClick={handleExportFiltered}
                  className="button is-info"
                  disabled={filteredCount === 0}
                >
                  Exportovat filtrované ({filteredCount})
                </button>
              )}
            </div>
          </div>

          {/* Purge Section */}
          <div className="box has-background-warning-light mb-5">
            <h2 className="title is-5 mb-4">
              ⚠️ Vymazat databázi
            </h2>

            <p className="mb-4">
              Tato akce trvale vymaže všechny objednávky z databáze a resetuje číslování
              objednávek.<br/>
              Data budou před vymazáním automaticky exportována.
            </p>

            <button
              onClick={() => setShowPurgeModal(true)}
              className="button is-danger has-text-white"
              disabled={orders.length === 0}
            >
              Vymazat databázi
            </button>
          </div>

          {/* Logout Section */}
          <div className="box">
            <h2 className="title is-5 mb-4">Odhlášení</h2>

            <p className="mb-4">
              Po odhlášení bude třeba znovu zadat heslo pro přístup k aplikaci.
            </p>

            <button
              onClick={onLogout}
              className="button is-danger has-text-white"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </div>

      {/* Purge Confirmation Modal */}
      {showPurgeModal && (
        <PurgeConfirmModal
          orders={getOrdersForExport()}
          onClose={() => setShowPurgeModal(false)}
          onPurgeComplete={async () => {
            await purgeAllOrders();
            await resetOrderNumber();
            setShowPurgeModal(false);
          }}
          purgeAllOrders={purgeAllOrders}
          resetOrderNumber={resetOrderNumber}
        />
      )}
    </div>
  );
};

export default SettingsView;
