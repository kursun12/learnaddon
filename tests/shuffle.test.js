import { shuffleArray } from '../src/util/shuffle.js';

describe('shuffleArray', () => {
  test('returns new array with same elements', () => {
    const original = [1, 2, 3, 4];
    const result = shuffleArray(original);
    expect(result).toHaveLength(original.length);
    // Same elements regardless of order
    expect(result.sort()).toEqual([...original].sort());
    // Ensure original not mutated
    expect(original).toEqual([1, 2, 3, 4]);
    // Result should be different reference
    expect(result).not.toBe(original);
  });
});
