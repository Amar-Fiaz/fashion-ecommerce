import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Container from "../components/Container";
import ProductSection from "../components/home/ProductSection";
import Button from "../components/Button";
import ImageGallery from "../features/product/ImageGallery";
import VariantSelector from "../features/product/VariantSelector";
import SizeGuide from "../features/product/SizeGuide";
import RecentlyViewed from "../features/product/RecentlyViewed";
import { useGetProductBySlugQuery } from "../features/product/productApi";
import {
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
} from "../features/cart/cartApi";
import { addRecentlyViewed } from "../utils/recentlyViewed";

function ProductDetailPage() {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetProductBySlugQuery(slug);
  const [selection, setSelection] = useState({ size: null, color: null });
  const { accessToken } = useSelector((state) => state.auth);

  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !accessToken });
  const [addWishlistItem] = useAddWishlistItemMutation();
  const [removeWishlistItem] = useRemoveWishlistItemMutation();

  const isWishlisted = wishlistData?.products?.some((p) => p._id === product?._id);

  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.isSale ? product.salePrice : null,
        image: product.images?.[0] || "",
      });
    }
  }, [product]);

  useEffect(() => {
    setSelection({ size: null, color: null });
  }, [slug]);

  const handleWishlistToggle = () => {
    if (!accessToken) {
      window.location.href = "/login";
      return;
    }
    if (isWishlisted) {
      removeWishlistItem(product._id);
    } else {
      addWishlistItem(product._id);
    }
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <p className="text-neutral-500">Loading product...</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-8">
        <p className="text-error">
          Product not found. It may have been removed or the link is incorrect.
        </p>
      </Container>
    );
  }

  const onSale = product.isSale && product.salePrice;

  return (
    <>
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ImageGallery images={product.images} productName={product.name} />

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">
                  {product.category?.name}
                  {product.subCategory ? ` / ${product.subCategory.name}` : ""}
                </p>
                <h1 className="text-2xl font-bold text-black">{product.name}</h1>
                {product.brand && <p className="text-sm text-neutral-500">{product.brand}</p>}
              </div>
              <Button variant="ghost" onClick={handleWishlistToggle} className="shrink-0">
                {isWishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {onSale ? (
                <>
                  <span className="text-lg font-medium text-error">${product.salePrice}</span>
                  <span className="text-sm text-neutral-500 line-through">${product.price}</span>
                </>
              ) : (
                <span className="text-lg font-medium text-black">${product.price}</span>
              )}
            </div>

            <p className="text-sm text-neutral-800">{product.description}</p>

            <VariantSelector
              product={product}
              variants={product.variants}
              selectedSize={selection.size}
              selectedColor={selection.color}
              onSelect={setSelection}
            />

            <SizeGuide />
          </div>
        </div>
      </Container>

      {relatedProducts.length > 0 && (
        <ProductSection
          title="You May Also Like"
          products={relatedProducts.map((p) => ({
            id: p._id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            salePrice: p.isSale ? p.salePrice : null,
            image: p.images?.[0] || "",
          }))}
        />
      )}

      <RecentlyViewed excludeSlug={product.slug} />
    </>
  );
}

export default ProductDetailPage;