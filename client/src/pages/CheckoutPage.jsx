import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Container from "../components/Container";
import Button from "../components/Button";
import Input from "../components/Input";
import AddressForm from "../features/user/AddressForm";
import { useCart } from "../features/cart/useCart";
import { useGetAddressesQuery } from "../features/user/userApi";
import { useCreateOrderMutation } from "../features/order/orderApi";
import { calculateOrderTotals } from "../features/order/orderTotals";
import { clearGuestItems } from "../features/cart/guestCartSlice";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, subtotal, isAuthenticated } = useCart();
  const { user } = useSelector((state) => state.auth);

  const { data: addressesData } = useGetAddressesQuery(undefined, { skip: !isAuthenticated });
  const savedAddresses = addressesData?.addresses || [];

  const [email, setEmail] = useState(user?.email || "");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(savedAddresses.length === 0);
  const [newAddress, setNewAddress] = useState(null);
  const [error, setError] = useState(null);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const { shippingCost, total } = calculateOrderTotals(subtotal);

  const handlePlaceOrder = async () => {
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!useNewAddress && !selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }
    if (useNewAddress && !newAddress) {
      setError("Please fill in your shipping address.");
      return;
    }

    const orderPayload = {
      email,
      items: items.map((item) => ({
        productId: item.productId,
        variantSku: item.variantSku,
        quantity: item.quantity,
      })),
      ...(useNewAddress ? { shippingAddress: newAddress } : { addressId: selectedAddressId }),
    };

    try {
      const result = await createOrder(orderPayload).unwrap();
      if (!isAuthenticated) {
        dispatch(clearGuestItems());
      }
      navigate(`/order-confirmation/${result.order._id}`, {
        state: { order: result.order },
      });
    } catch (err) {
      setError(err?.data?.message || "Could not place your order. Please try again.");
    }
  };

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
      <h1 className="text-2xl font-bold text-black mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <section>
            <h2 className="text-lg font-semibold text-black mb-3">Contact email</h2>
            <Input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="max-w-sm"
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-black mb-3">Shipping address</h2>

            {savedAddresses.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr._id}
                    className="flex items-start gap-2 border border-neutral-200 rounded-md p-3 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={!useNewAddress && selectedAddressId === addr._id}
                      onChange={() => {
                        setUseNewAddress(false);
                        setSelectedAddressId(addr._id);
                      }}
                    />
                    <span>
                      {addr.fullName}, {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city} {addr.postalCode},{" "}
                      {addr.country}
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="address"
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(true)}
                  />
                  Use a new address
                </label>
              </div>
            )}

            {useNewAddress && (
              <AddressForm
                isSubmitting={false}
                onCancel={() => {
                  if (savedAddresses.length > 0) setUseNewAddress(false);
                }}
                onSubmit={(data) => {
                  setNewAddress(data);
                }}
              />
            )}

            {useNewAddress && newAddress && (
              <p className="text-sm text-success mt-2">Address ready to use for this order.</p>
            )}
          </section>

          {error && <p className="text-sm text-error">{error}</p>}
        </div>

        <div className="w-full lg:w-72 shrink-0 border border-neutral-200 rounded-md p-4 h-fit flex flex-col gap-3">
          <h2 className="text-base font-semibold text-black">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-neutral-800">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${item.lineTotal}</span>
            </div>
          ))}
          <div className="border-t border-neutral-200 pt-3 flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-black text-base pt-1">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500">
            Final total is verified by the server when your order is placed.
          </p>
          <Button variant="primary" className="w-full" disabled={isLoading} onClick={handlePlaceOrder}>
            {isLoading ? "Placing order..." : "Place Order (Cash on Delivery)"}
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default CheckoutPage;