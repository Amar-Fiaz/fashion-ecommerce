// Guest cart persistence via localStorage - the client-side half of
// the cart-duality pattern from ARCHITECTURE.md/DATABASE.md. Mirrors
// the pattern already established for recentlyViewed.js in Phase 6.
// Only used while logged out; once authenticated, the backend cart
// (Phase 8 Step 1's API) is the source of truth.

const STORAGE_KEY = "guestCart";

export function getGuestCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Non-critical - if localStorage is unavailable (private
    // browsing, storage full), the cart simply won't persist across
    // reloads, but the current session still works via Redux state.
  }
}

export function clearGuestCart() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}