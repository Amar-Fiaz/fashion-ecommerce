import Container from "../Container";
import ProductCard from "../ProductCard";

// Titled grid/row of ProductCards, reused for Featured, New Arrivals,
// and Sale sections on the homepage. Fully data-driven via the
// `products` prop.

function ProductSection({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-10">
      <Container>
        <h2 className="text-xl font-semibold text-black mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ProductSection;