export function advanceLearnQueue(queue, wasCorrect) {
  const [first, ...rest] = queue;
  if (wasCorrect) {
    return rest;
  }
  return [...rest, first];
}
