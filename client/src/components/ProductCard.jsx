import { Link } from "react-router-dom";

// Reusable product card. Data-driven and presentation-only. When the
// product includes a `slug`, the card links to its detail page
// (Phase 6); if no slug is present, it renders as a static,
// non-navigating card (e.g. for future contexts that might not have
// a real product behind them).

function ProductCard({ product }) {
  const { name, price, salePrice, image, slug } = product;
  const onSale = Boolean(salePrice);

  const content = (
    <div className="flex flex-col gap-2 group cursor-pointer">
      <div className="aspect-[3/4] w-full bg-neutral-50 border border-neutral-200 rounded-md flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-neutral-500">Image placeholder</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm text-neutral-800 group-hover:text-black transition-colors">
          {name}
        </p>
        <div className="flex items-center gap-2">
          {onSale ? (
            <>
              <span className="text-sm font-medium text-error">
                ${salePrice}
              </span>
              <span className="text-sm text-neutral-500 line-through">
                ${price}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-black">${price}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (slug) {
    return <Link to={`/shop/${slug}`}>{content}</Link>;
  }

  return content;
}

export default ProductCard;