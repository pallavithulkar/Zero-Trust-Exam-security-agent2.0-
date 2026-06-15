// Helper to convert ArrayBuffer to Hex string
export function bufToHex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

// Helper to convert Hex string to Uint8Array
export function hexToBuf(hexString) {
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }
  const numBytes = hexString.length / 2;
  const byteArray = new Uint8Array(numBytes);
  for (let i = 0; i < numBytes; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

// Generate a random 256-bit symmetric key as a Hex string
export function generateKeyHex() {
  const array = new Uint8Array(32); // 32 bytes = 256 bits
  window.crypto.getRandomValues(array);
  return bufToHex(array);
}

// SHA-256 Hash of any string (returns Hex string)
export async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bufToHex(hashBuffer);
}

// Import key from Hex string into CryptoKey object
async function importKey(keyHex) {
  const keyBuf = hexToBuf(keyHex);
  return await window.crypto.subtle.importKey(
    'raw',
    keyBuf,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a plaintext string using AES-256-GCM
 * @param {string} plaintext 
 * @param {string} keyHex (256-bit key in Hex)
 * @returns {Promise<{ ciphertext: string, iv: string, authTag: string }>} Hex strings
 */
export async function encryptAES_GCM(plaintext, keyHex) {
  const key = await importKey(keyHex);
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  // GCM recommends a 12-byte (96-bit) IV
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128 // 128 bits = 16 bytes authentication tag
    },
    key,
    data
  );

  // In Web Crypto, the authentication tag is appended to the ciphertext
  const fullBytes = new Uint8Array(encryptedBuffer);
  const ciphertextBytes = fullBytes.slice(0, fullBytes.length - 16);
  const authTagBytes = fullBytes.slice(fullBytes.length - 16);

  return {
    ciphertext: bufToHex(ciphertextBytes),
    iv: bufToHex(iv),
    authTag: bufToHex(authTagBytes)
  };
}

/**
 * Decrypt a ciphertext using AES-256-GCM
 * @param {string} ciphertextHex 
 * @param {string} ivHex 
 * @param {string} authTagHex 
 * @param {string} keyHex 
 * @returns {Promise<string>} original plaintext
 */
export async function decryptAES_GCM(ciphertextHex, ivHex, authTagHex, keyHex) {
  const key = await importKey(keyHex);
  const ciphertextBytes = hexToBuf(ciphertextHex);
  const ivBytes = hexToBuf(ivHex);
  const authTagBytes = hexToBuf(authTagHex);

  // Combine ciphertext and authTag back into a single buffer for Web Crypto
  const fullBytes = new Uint8Array(ciphertextBytes.length + authTagBytes.length);
  fullBytes.set(ciphertextBytes, 0);
  fullBytes.set(authTagBytes, ciphertextBytes.length);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
      tagLength: 128
    },
    key,
    fullBytes
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Calculates the next row hash for an append-only score ledger block
 * @param {string} prevHash 
 * @param {string} examId 
 * @param {string} studentId 
 * @param {number} score 
 * @returns {Promise<string>} new row hash
 */
export async function computeLedgerRowHash(prevHash, examId, studentId, score) {
  const rawString = `${prevHash || 'GENESIS'}:${examId}:${studentId}:${score}`;
  return await sha256(rawString);
}
