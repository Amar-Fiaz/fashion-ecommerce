import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "../components/Container";
import ProductSection from "../components/home/ProductSection";
import ImageGallery from "../features/product/ImageGallery";
import VariantSelector from "../features/product/VariantSelector";
import SizeGuide from "../features/product/SizeGuide";
import RecentlyViewed from "../features/product/RecentlyViewed";
import { useGetProductBySlugQuery } from "../features/product/productApi";
import { addRecentlyViewed } from "../utils/recentlyViewed";
import { useState } from "react";

function ProductDetailPage() {
  const { slug } = useParams();
  const { data, isLoading, error } = useGetProductBySlugQuery(slug);
  const [selection, setSelection] = useState({ size: null, color: null });

  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  // Records this product as recently viewed once it loads. Runs only
  // when the product data actually changes (i.e. on slug change),
  // not on every render.
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

  // Reset variant selection when navigating between different
  // products (e.g. via related products), so a size/color chosen on
  // one product doesn't visually carry over to the next.
  useEffect(() => {
    setSelection({ size: null, color: null });
  }, [slug]);

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
            <div>
              <p className="text-sm text-neutral-500">
                {product.category?.name}
                {product.subCategory ? ` / ${product.subCategory.name}` : ""}
              </p>
              <h1 className="text-2xl font-bold text-black">{product.name}</h1>
              {product.brand && (
                <p className="text-sm text-neutral-500">{product.brand}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onSale ? (
                <>
                  <span className="text-lg font-medium text-error">
                    ${product.salePrice}
                  </span>
                  <span className="text-sm text-neutral-500 line-through">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-medium text-black">
                  ${product.price}
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-800">{product.description}</p>

            <VariantSelector
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