import { keyToIndex } from '../src/util/keyToIndex.js';

describe('keyToIndex', () => {
  test('maps numbers to indices', () => {
    expect(keyToIndex('1')).toBe(0);
    expect(keyToIndex('3')).toBe(2);
  });

  test('maps letters to indices case-insensitively', () => {
    expect(keyToIndex('A')).toBe(0);
    expect(keyToIndex('d')).toBe(3);
  });

  test('returns -1 for unknown keys', () => {
    expect(keyToIndex('0')).toBe(-1);
    expect(keyToIndex('Z')).toBe(-1);
    expect(keyToIndex('')).toBe(-1);
  });
});
