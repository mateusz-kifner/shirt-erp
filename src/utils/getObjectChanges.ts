function getObjectChanges<T>(obj1: T, obj2: T): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in obj1) {
    if (
      obj1[key] !== undefined &&
      obj2[key] !== undefined &&
      obj1[key] !== obj2[key]
    ) {
      changes[key] = obj2[key];
    }
  }

  return changes;
}
export default getObjectChanges;
