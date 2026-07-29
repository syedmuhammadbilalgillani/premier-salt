export const SHIPPING_FLAT_RATE = 250;
export const FREE_SHIPPING_THRESHOLD = 5000;
export const DISCOUNT_CODE = "SALT10";
export const DISCOUNT_RATE = 0.1;

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}

export function calculateDiscount(subtotal: number, code: string): number {
  return code.trim().toUpperCase() === DISCOUNT_CODE ? Math.round(subtotal * DISCOUNT_RATE) : 0;
}
