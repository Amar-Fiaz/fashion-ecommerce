import { Link } from "react-router-dom";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import { useGetWishlistQuery, useRemoveWishlistItemMutation } from "../features/cart/cartApi";

function WishlistPage() {
  const { data, isLoading } = useGetWishlistQuery();
  const [removeWishlistItem] = useRemoveWishlistItemMutation();

  const products = data?.products || [];

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-black mb-6">My Wishlist</h1>

      {isLoading && <p className="text-neutral-500">Loading...</p>}

      {!isLoading && products.length === 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-neutral-500">Your wishlist is empty.</p>
          <Link to="/shop" className="text-sm text-black underline w-fit">
            Browse products
          </Link>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="flex flex-col gap-2">
              <ProductCard product={product} />
              <Button
                variant="ghost"
                onClick={() => removeWishlistItem(product._id)}
                className="text-error"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default WishlistPage;