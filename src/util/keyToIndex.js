/**
 * Map keyboard key to an option index.
 * Accepts numeric keys 1-8 and letter keys A-H (case-insensitive).
 * Returns the zero-based index or -1 if not recognized.
 * @param {string} key
 * @returns {number}
 */
export function keyToIndex(key) {
  if (!key) return -1;
  // Numeric keys "1".."8"
  if (/^[1-8]$/.test(key)) {
    return Number(key) - 1;
  }
  // Letter keys "A".."H"
  const upper = key.toUpperCase();
  if (/^[A-H]$/.test(upper)) {
    return upper.charCodeAt(0) - 65;
  }
  return -1;
}
