import { Link } from "react-router-dom";
import Container from "../components/Container";
import Button from "../components/Button";
import { useCart } from "../features/cart/useCart";

function CartPage() {
  const { items, subtotal, itemCount, isLoading, updateQuantity, removeItem } = useCart();

  if (isLoading) {
    return (
      <Container className="py-8">
        <p className="text-neutral-500">Loading your cart...</p>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-12 text-center flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-black">Your cart is empty</h1>
        <Link to="/shop" className="text-sm text-black underline w-fit mx-auto">
          Continue shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold text-black mb-6">
        Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border border-neutral-200 rounded-md p-4"
            >
              <div className="w-20 h-20 bg-neutral-50 border border-neutral-200 rounded-sm flex items-center justify-center shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-neutral-500 text-center px-1">No image</span>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <Link to={`/shop/${item.slug}`} className="text-sm text-black hover:underline">
                  {item.name}
                </Link>
                <p className="text-sm text-neutral-500">
                  {item.size} / {item.color}
                </p>
                <p className="text-sm font-medium text-black">${item.unitPrice}</p>
                {item.insufficientStock && (
                  <p className="text-xs text-error">
                    Only {item.availableStock} available - please reduce quantity
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <label htmlFor={`qty-${item.id}`} className="text-xs text-neutral-500">
                    Qty
                  </label>
                  <select
                    id={`qty-${item.id}`}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item, Number(e.target.value))}
                    className="px-2 py-1 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
                  >
                    {Array.from({ length: Math.max(item.availableStock, item.quantity, 1) }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="text-sm font-medium text-black">${item.lineTotal}</p>
                <button
                  type="button"
                  className="text-xs text-error hover:opacity-80"
                  onClick={() => removeItem(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-72 shrink-0 border border-neutral-200 rounded-md p-4 h-fit flex flex-col gap-4">
          <div className="flex items-center justify-between text-base font-semibold text-black">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <p className="text-xs text-neutral-500">
            Shipping and any discounts are calculated at checkout.
          </p>
          <Button variant="primary" disabled className="w-full">
            Checkout
          </Button>
          {/* Checkout is intentionally non-functional - Phase 9 scope. */}
        </div>
      </div>
    </Container>
  );
}

export default CartPage;