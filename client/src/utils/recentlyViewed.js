// Client-side "recently viewed" tracking via localStorage. No backend
// model exists for this (and none is planned - see docs/DATABASE.md),
// so this is intentionally a plain browser API used directly, capped
// at the last 8 products.

const STORAGE_KEY = "recentlyViewedProducts";
const MAX_ITEMS = 8;

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Adds a product to the front of the list, de-duplicating by slug,
// and caps the list at MAX_ITEMS.
export function addRecentlyViewed(product) {
  try {
    const current = getRecentlyViewed();
    const filtered = current.filter((p) => p.slug !== product.slug);
    const updated = [product, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage can fail (private browsing, storage full, etc.) -
    // recently-viewed is a non-critical enhancement, so failures are
    // silently ignored rather than breaking the page.
  }
}