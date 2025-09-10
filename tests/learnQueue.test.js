import { advanceLearnQueue } from '../src/util/learnQueue.js';

test('removes card when answered correctly', () => {
  const queue = [1,2,3];
  const next = advanceLearnQueue(queue, true);
  expect(next).toEqual([2,3]);
});

test('requeues card when answered incorrectly', () => {
  const queue = [1,2,3];
  const next = advanceLearnQueue(queue, false);
  expect(next).toEqual([2,3,1]);
});
