import { useParams, Link } from "react-router-dom";
import Container from "../components/Container";
import { useGetOrderByIdQuery } from "../features/order/orderApi";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOrderByIdQuery(id);
  const order = data?.order;

  if (isLoading) {
    return (
      <Container className="py-8">
        <p className="text-neutral-500">Loading order...</p>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-8">
        <p className="text-error">Order not found.</p>
      </Container>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <Container className="py-8 max-w-2xl">
      <Link to="/orders" className="text-sm text-neutral-500 hover:text-black">
        ← Back to orders
      </Link>

      <h1 className="text-2xl font-bold text-black mt-3 mb-1">{order.orderNumber}</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

      {order.status !== "cancelled" ? (
        <div className="flex items-center gap-2 mb-8">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    i <= currentStepIndex ? "bg-black text-white" : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {i + 1}
                </div>
                <p className="text-xs text-neutral-500 mt-1 capitalize">{step}</p>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${i < currentStepIndex ? "bg-black" : "bg-neutral-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-error mb-8">This order has been cancelled.</p>
      )}

      <div className="border border-neutral-200 rounded-md p-4 flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-black mb-2">Items</p>
          <div className="flex flex-col gap-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm text-neutral-800">
                <span>
                  {item.name} ({item.size}/{item.color}) × {item.quantity}
                </span>
                <span>${item.lineTotal}</span>
              </div>
            ))}
          </div>
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
          <span className="text-neutral-500">Payment</span>
          <span className="text-black">
            Cash on Delivery · {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
          </span>
        </div>
      </div>
    </Container>
  );
}

export default OrderDetailPage;