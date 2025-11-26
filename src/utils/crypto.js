/**
 * Cryptographic utilities for password hashing and token generation
 * Uses Web Crypto API (built into modern browsers, no dependencies needed)
 */

/**
 * Hash a password using SHA-256
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - Hex string of the hash
 */
export async function hashPassword(password) {
  // Convert password string to bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Generate a cryptographically secure random token
 * @returns {string} - 64-character hex string (32 bytes)
 */
export function generateToken() {
  // Generate 32 random bytes
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  // Convert to hex string
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validate that a string is a valid hex token (64 chars, hex only)
 * @param {string} token - The token to validate
 * @returns {boolean} - True if valid format
 */
export function isValidToken(token) {
  return typeof token === 'string' &&
         token.length === 64 &&
         /^[0-9a-f]{64}$/.test(token);
}
