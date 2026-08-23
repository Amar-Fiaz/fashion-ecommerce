import { useSearchParams } from "react-router-dom";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../features/product/ProductFilters";
import ProductSort from "../features/product/ProductSort";
import Pagination from "../features/product/Pagination";
import { useGetProductsQuery } from "../features/product/productApi";

// Real, API-driven product listing page. Filter/sort/page state
// lives in the URL query string (via useSearchParams) rather than a
// separate Redux slice - shareable/bookmarkable, and avoids adding
// new client state management beyond what's already approved.
function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = Object.fromEntries(searchParams.entries());
  const queryArgs = {
    ...filters,
    page: filters.page || 1,
    limit: 12,
  };

  const { data, isLoading, isFetching, error } = useGetProductsQuery(queryArgs);

  const updateFilters = (nextFilters) => {
    const cleaned = Object.fromEntries(
      Object.entries(nextFilters).filter(([, v]) => v !== "" && v !== undefined && v !== null)
    );
    setSearchParams(cleaned);
  };

  const setPage = (page) => {
    updateFilters({ ...filters, page: String(page) });
  };

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-black mb-6">Shop</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters filters={filters} onChange={updateFilters} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-500">
              {data ? `${data.pagination.total} products` : ""}
            </p>
            <ProductSort
              value={filters.sort}
              onChange={(sort) => updateFilters({ ...filters, sort })}
            />
          </div>

          {isLoading && <p className="text-neutral-500">Loading products...</p>}

          {error && (
            <p className="text-error">
              Something went wrong loading products. Please try again.
            </p>
          )}

          {!isLoading && !error && data?.products.length === 0 && (
            <p className="text-neutral-500">No products match these filters.</p>
          )}

          {!isLoading && !error && data?.products.length > 0 && (
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {data.products.map((product) => (
                <ProductCard key={product._id} product={mapProduct(product)} />
              ))}
            </div>
          )}

          {data && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onChange={setPage}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

// ProductCard expects { name, price, salePrice, image } - this maps
// the real API's product shape onto that same interface, so
// ProductCard itself needs zero changes between Phase 4's mock data
// and Phase 5's real data.
function mapProduct(product) {
  return {
    id: product._id,
    name: product.name,
    price: product.price,
    salePrice: product.isSale ? product.salePrice : null,
    image: product.images?.[0] || "",
  };
}

export default ProductListingPage;