export function isNumber(val: string) {
  return !isNaN(val as unknown as number);
}
