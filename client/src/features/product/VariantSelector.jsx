import { useMemo, useState } from "react";
import Button from "../../components/Button";
import { useCart } from "../cart/useCart";

function VariantSelector({ product, variants, selectedSize, selectedColor, onSelect }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);

  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size))], [variants]);
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color))], [variants]);

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const hasStockForSize = (size) => variants.some((v) => v.size === size && v.stock > 0);
  const hasStockForColor = (color) => variants.some((v) => v.color === color && v.stock > 0);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    setError(null);
    setAdded(false);
    try {
      await addItem({ product, variant: selectedVariant, quantity: 1 });
      setAdded(true);
    } catch (err) {
      setError(err?.data?.message || "Could not add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-black mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const disabled = !hasStockForSize(size);
            return (
              <button
                key={size}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onSelect({ size, color: selectedColor });
                  setAdded(false);
                }}
                className={`px-3 py-2 text-sm rounded-sm border transition-colors ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-800 hover:border-black"
                } disabled:opacity-40 disabled:pointer-events-none disabled:line-through`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-black mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const disabled = !hasStockForColor(color);
            return (
              <button
                key={color}
                type="button"
                disabled={disabled}
                onClick={() => {
                  onSelect({ size: selectedSize, color });
                  setAdded(false);
                }}
                className={`px-3 py-2 text-sm rounded-sm border transition-colors ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 text-neutral-800 hover:border-black"
                } disabled:opacity-40 disabled:pointer-events-none disabled:line-through`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-sm">
        {selectedSize && selectedColor && (
          <>
            {selectedVariant ? (
              selectedVariant.stock > 0 ? (
                <p className="text-success">In stock ({selectedVariant.stock} available)</p>
              ) : (
                <p className="text-error">Out of stock in this combination</p>
              )
            ) : (
              <p className="text-error">Not available in this combination</p>
            )}
          </>
        )}
      </div>

      <Button
        variant="primary"
        disabled={!selectedVariant || selectedVariant.stock === 0 || adding}
        onClick={handleAddToCart}
        className="w-full sm:w-auto"
      >
        {adding ? "Adding..." : "Add to Cart"}
      </Button>
      {added && <p className="text-sm text-success">Added to cart.</p>}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}

export default VariantSelector;