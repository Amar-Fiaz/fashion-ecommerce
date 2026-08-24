import ProductSection from "../../components/home/ProductSection";
import { getRecentlyViewed } from "../../utils/recentlyViewed";

// Reads recently-viewed products from localStorage and reuses the
// existing ProductSection/ProductCard components to display them -
// same visual pattern as the homepage's product rows.
function RecentlyViewed({ excludeSlug }) {
  const items = getRecentlyViewed().filter((p) => p.slug !== excludeSlug);

  if (items.length === 0) return null;

  return <ProductSection title="Recently Viewed" products={items} />;
}

export default RecentlyViewed;