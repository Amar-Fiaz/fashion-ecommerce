import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { useCart } from "./useCart";

// Right-side slide-in drawer, matching the pattern already
// established by MobileNav (Phase 3). Checkout is a non-functional
// placeholder - real checkout is Phase 9.
function MiniCart({ open, onClose }) {
  const { items, subtotal, removeItem } = useCart();

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-40 shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <span className="text-lg font-semibold text-black">Your Cart</span>
          <button onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 && (
            <p className="text-sm text-neutral-500">Your cart is empty.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 rounded-sm flex items-center justify-center shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-neutral-500 text-center px-1">
                    No image
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <p className="text-sm text-neutral-800">{item.name}</p>
                <p className="text-xs text-neutral-500">
                  {item.size} / {item.color} × {item.quantity}
                </p>
                <p className="text-sm font-medium text-black">
                  ${item.lineTotal}
                </p>
                {item.insufficientStock && (
                  <p className="text-xs text-error">Limited stock available</p>
                )}
              </div>
              <button
                type="button"
                className="text-xs text-error hover:opacity-80 self-start"
                onClick={() => removeItem(item)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm font-medium text-black">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <Link to="/cart" onClick={onClose}>
              <Button variant="secondary" className="w-full">
                View Cart
              </Button>
            </Link>
            <Link to="/checkout" onClick={onClose}>
              <Button variant="primary" className="w-full">
                Checkout
              </Button>
            </Link>
            {/* Checkout is intentionally non-functional - Phase 9 scope. */}
          </div>
        )}
      </div>
    </>
  );
}

export default MiniCart;
