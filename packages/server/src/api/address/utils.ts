import type { Address } from "./validator";

export const addressToString = (address?: Omit<Address, "id">) => {
  if (!address) return undefined;
  return (
    (address.streetName ? `ul. ${address.streetName} ` : "") +
    (address.streetNumber || "") +
    (address.apartmentNumber ? ` / ${address.apartmentNumber}` : "") +
    (address.streetName || address.streetNumber || address.apartmentNumber
      ? "\n"
      : "") +
    (address.secondLine ? `${address.secondLine}\n` : "") +
    (address.postCode ? `${address.postCode} ` : "") +
    (address.city || "") +
    (address.postCode || address.city ? "\n" : "") +
    address.province
  );
};
