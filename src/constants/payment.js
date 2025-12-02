// Payment configuration for QR platba (SPAYD format)
// Czech QR payment standard

export const paymentConfig = {
  // Bank account in IBAN format
  iban: 'CZ3001000000430831990287',

  // Account number in Czech format (optional, for display)
  accountNumber: '43-831990287/0100',

  // Beneficiary name
  beneficiary: 'Ondřej Mužík',

  // Currency (always CZK for Czech payments)
  currency: 'CZK',

  // Payment message prefix
  messagePrefix: 'Čertovský svařáček 2025',
};

/**
 * Generate SPAYD format string for QR platba
 * @param {number} amount - Payment amount in CZK
 * @param {number} orderNumber - Order number (used as variable symbol)
 * @param {string} message - Optional payment message
 * @returns {string} SPAYD formatted string
 */
export const generateSPAYD = (amount, orderNumber, message = '') => {
  const parts = [
    'SPD*1.0',
    `ACC:${paymentConfig.iban}`,
    `AM:${amount.toFixed(2)}`,
    `CC:${paymentConfig.currency}`,
  ];

  // Add variable symbol (order number)
  if (orderNumber) {
    parts.push(`X-VS:${orderNumber}`);
  }

  // Add payment message
  const paymentMessage = message || `${paymentConfig.messagePrefix} #${orderNumber}`;
  if (paymentMessage) {
    parts.push(`MSG:${paymentMessage}`);
  }

  return parts.join('*');
};
