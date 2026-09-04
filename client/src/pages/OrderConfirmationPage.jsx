import { useLocation, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Container from "../components/Container";
import { useGetOrderByIdQuery } from "../features/order/orderApi";

// Works two ways: immediately after checkout, the order is passed
// via router state (avoiding an extra fetch, and working for guests
// who have no way to re-fetch this order later). If visited directly
// (e.g. a bookmarked/refreshed link) by an authenticated user whose
// order this is, it re-fetches via the API instead.
function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const orderFromState = location.state?.order;

  const { data, isLoading, error } = useGetOrderByIdQuery(id, {
    skip: Boolean(orderFromState) || !accessToken,
  });

  const order = orderFromState || data?.order;

  if (!orderFromState && isLoading) {
    return (
      <Container className="py-12">
        <p className="text-neutral-500">Loading your order...</p>
      </Container>
    );
  }

  if (!order || error) {
    return (
      <Container className="py-12 text-center flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-black">Order not found</h1>
        <p className="text-sm text-neutral-500">
          If you just placed this order as a guest, this confirmation is only
          available right after checkout - please check the email confirmation
          for your order details.
        </p>
        <Link to="/shop" className="text-sm text-black underline w-fit mx-auto">
          Continue shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 max-w-xl mx-auto flex flex-col gap-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-black">Thank you for your order</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Order <span className="font-medium text-black">{order.orderNumber}</span>
        </p>
      </div>

      <div className="border border-neutral-200 rounded-md p-4 text-left flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-black mb-1">Items</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-neutral-800">
              <span>
                {item.name} ({item.size}/{item.color}) × {item.quantity}
              </span>
              <span>${item.lineTotal}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 pt-3 flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost}`}</span>
          </div>
          <div className="flex justify-between font-semibold text-black">
            <span>Total</span>
            <span>${order.total}</span>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-3">
          <p className="text-sm font-medium text-black mb-1">Shipping to</p>
          <p className="text-sm text-neutral-500">
            {order.shippingAddress.fullName}, {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""},{" "}
            {order.shippingAddress.city} {order.shippingAddress.postalCode},{" "}
            {order.shippingAddress.country}
          </p>
        </div>

        <div className="border-t border-neutral-200 pt-3 flex justify-between text-sm">
          <span className="text-neutral-500">Payment method</span>
          <span className="text-black">Cash on Delivery</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Status</span>
          <span className="text-black capitalize">{order.status}</span>
        </div>
      </div>

      <Link to="/shop" className="text-sm text-black underline w-fit mx-auto">
        Continue shopping
      </Link>
    </Container>
  );
}

export default OrderConfirmationPage;