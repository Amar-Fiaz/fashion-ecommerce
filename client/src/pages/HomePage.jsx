import Hero from "../components/home/Hero";
import PromoBanner from "../components/home/PromoBanner";
import ProductSection from "../components/home/ProductSection";
import NewsletterSignup from "../components/home/NewsletterSignup";
import homepageMockProducts from "../components/home/homepageMockProducts";

// Real homepage content (Phase 4), replacing the Phase 1/2/3
// placeholder page. Uses mock product data - replaced with real
// API-driven data in Phase 5, per CLAUDE.md Section 10.
function HomePage() {
  const featured = homepageMockProducts.filter((p) => p.isFeatured);
  const newArrivals = homepageMockProducts.filter((p) => p.isNewArrival);
  const sale = homepageMockProducts.filter((p) => p.isSale);

  return (
    <>
      <Hero />
      <PromoBanner />
      <ProductSection title="Featured" products={featured} />
      <ProductSection title="New Arrivals" products={newArrivals} />
      <ProductSection title="Sale" products={sale} />
      <NewsletterSignup />
    </>
  );
}

export default HomePage;