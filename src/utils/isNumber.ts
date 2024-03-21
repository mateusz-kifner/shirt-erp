export function isNumber(val: string) {
  return !Number.isNaN(val as unknown as number);
}
