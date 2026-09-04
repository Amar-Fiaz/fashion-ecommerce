// Client-side preview only, mirroring order.service.js's rule exactly.
// The backend independently recomputes this from live data and is
// the actual source of truth - this is display-only, never trusted
// for the real charge.
const FLAT_SHIPPING_COST = 8;
const FREE_SHIPPING_THRESHOLD = 75;

export function calculateOrderTotals(subtotal) {
  const shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
  return { shippingCost, total: subtotal + shippingCost };
}