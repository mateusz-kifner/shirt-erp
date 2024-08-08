export function uniqByKeepFirst<T>(a: T[], key: (it: T) => unknown) {
  const seen = new Set();
  return a.filter((item) => {
    const k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}
