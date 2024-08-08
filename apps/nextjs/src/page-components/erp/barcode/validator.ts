const weights = [
  5417, 10597, 7019, 3943, 6359, 3049, 7321, 8573, 2269, 3533, 4793,
];

// EAN-13 X      XXXXXXXXXX   X              X
//        ^api   ^code        ^this parity   ^ EAN-13 parity

export function validateBarcodeParity(barcode: number): boolean {
  if (barcode > 9999999999999) return false;
  const parity = Math.floor((barcode / 10) % 10);

  const computedParity = computeBarcodeParity(barcode / 100);
  return parity === computedParity;
}

export function computeBarcodeParity(barcode: number): number {
  let parity = 0;
  let b = Math.floor(barcode);

  for (let i = 0; i < 11; i++) {
    const digit = Math.floor(b % 10);
    // biome-ignore lint/style/noNonNullAssertion: already checked
    parity += Math.floor((digit * weights[i]!) % 10);
    b = Math.floor(b / 10);
  }
  return Math.floor((10 - (parity % 10)) % 10);
}
// old one
// const weights = [
//   4793, 3533, 2269, 8573, 7321, 3049, 6359, 3943, 7019, 10597, 5417,
// ];
// export function validateBarcodeParity(barcode: string): boolean {
//   if (barcode.length !== 13) return false;
//   const parity = computeBarcodeParity(barcode.substring(0, 11));
//   // biome-ignore lint/style/noNonNullAssertion: already checked
//   return Number.parseInt(barcode[11]!) === parity;
// }
// export function computeBarcodeParity(barcode: string): number {
//   if (barcode.length !== 11) return -1;

//   let parity = 0;

//   let i = 0;
//   for (const digit_str of barcode) {
//     const digit = Number.parseInt(digit_str);
//     // biome-ignore lint/style/noNonNullAssertion: already checked
//     parity += (digit * weights[i]!) % 10;
//     i++;
//   }

//   return (10 - (parity % 10)) % 10;
// }
