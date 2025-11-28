/**
 * CSV Export Utilities
 * Handles CSV generation, filtering, and download for order data
 */

/**
 * Escapes a value for CSV format
 * Handles quotes, commas, and newlines
 */
const escapeCSVValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

/**
 * Generates a timestamped filename for CSV export
 * Format: certovske-objednavky-YYYY-MM-DD-HHMMSS.csv
 */
export const generateCSVFilename = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `certovske-objednavky-${year}-${month}-${day}-${hours}${minutes}${seconds}.csv`;
};

/**
 * Filters orders by date range (inclusive)
 * @param {Array} orders - Array of order objects
 * @param {string} dateFrom - Start date (YYYY-MM-DD format) or null
 * @param {string} dateTo - End date (YYYY-MM-DD format) or null
 * @returns {Array} Filtered orders
 */
export const filterOrdersByDateRange = (orders, dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) {
    return orders;
  }

  return orders.filter(order => {
    // Parse the created_at timestamp
    const orderDate = new Date(order.created_at);
    const orderDateOnly = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());

    // Check date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (orderDateOnly < fromDate) {
        return false;
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      if (orderDateOnly > toDate) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Generates CSV content from orders
 * Creates one row per order item (beverages, extra cups, cup returns)
 *
 * @param {Array} orders - Array of order objects
 * @param {Object} options - Optional configuration
 * @param {string} options.dateFrom - Filter start date (YYYY-MM-DD)
 * @param {string} options.dateTo - Filter end date (YYYY-MM-DD)
 * @returns {string} CSV content
 */
export const generateOrdersCSV = (orders, options = {}) => {
  // Apply date filtering if specified
  let filteredOrders = orders;
  if (options.dateFrom || options.dateTo) {
    filteredOrders = filterOrdersByDateRange(orders, options.dateFrom, options.dateTo);
  }

  // CSV header
  const headers = [
    'order_id',
    'order_number',
    'item_name',
    'item_price',
    'is_staff_order',
    'timestamp',
    'created_at',
    'order_total',
    'order_note',
    'completed'
  ];

  const rows = [headers.join(',')];

  // Generate rows - one per order item
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const row = [
        escapeCSVValue(order.id),
        escapeCSVValue(order.order_number),
        escapeCSVValue(item.name),
        escapeCSVValue(item.price),
        escapeCSVValue(order.is_staff_order ? 'Yes' : 'No'),
        escapeCSVValue(order.timestamp),
        escapeCSVValue(order.created_at),
        escapeCSVValue(order.total),
        escapeCSVValue(order.note || ''),
        escapeCSVValue(order.completed ? 'Yes' : 'No')
      ];
      rows.push(row.join(','));
    });
  });

  return rows.join('\n');
};

/**
 * Downloads CSV content as a file
 * Adds UTF-8 BOM for Excel compatibility
 *
 * @param {string} csvContent - CSV content to download
 * @param {string} filename - Filename for the download
 */
export const downloadCSV = (csvContent, filename) => {
  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
};
