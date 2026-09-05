import { useLocation, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Container from "../components/Container";
import { useGetOrderByIdQuery } from "../features/order/orderApi";

function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const orderFromState = location.state?.order;
  const paymentFromState = location.state?.payment;
  const paymentOutcome = location.state?.paymentOutcome;

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

  const isBankTransfer = order.paymentMethod === "bank_transfer";
  const mockPaymentFailed = paymentOutcome === "failure";

  return (
    <Container className="py-12 max-w-xl mx-auto flex flex-col gap-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-black">
          {mockPaymentFailed ? "Order placed - payment not completed" : "Thank you for your order"}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Order <span className="font-medium text-black">{order.orderNumber}</span>
        </p>
      </div>

      {mockPaymentFailed && (
        <p className="text-sm text-error border border-error rounded-md p-3">
          Your simulated payment was not successful. Your order has been recorded,
          but payment is still marked unpaid.
        </p>
      )}

      {isBankTransfer && paymentFromState?.bankDetails && (
        <div className="border border-accent rounded-md p-4 text-left flex flex-col gap-1">
          <p className="text-sm font-semibold text-black mb-1">
            Bank Transfer Instructions
          </p>
          <p className="text-sm text-neutral-800">
            Account Title: {paymentFromState.bankDetails.accountTitle}
          </p>
          <p className="text-sm text-neutral-800">
            Account Number: {paymentFromState.bankDetails.accountNumber}
          </p>
          <p className="text-sm text-neutral-800">Bank: {paymentFromState.bankDetails.bankName}</p>
          <p className="text-sm text-neutral-800">IBAN: {paymentFromState.bankDetails.iban}</p>
          <p className="text-xs text-neutral-500 mt-2">
            Please transfer the total amount and reference your order number.
            Your order will be processed once payment is confirmed.
          </p>
        </div>
      )}

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
          <span className="text-black capitalize">
            {order.paymentMethod.replace("_", " ")}
          </span>
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