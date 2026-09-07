import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Container from "../components/Container";
import Button from "../components/Button";
import { useGetMockPaymentQuery, useVerifyMockPaymentMutation } from "../features/payment/paymentApi";

function MockGatewayPage() {
  const { paymentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  const { data, isLoading, isError } = useGetMockPaymentQuery(paymentId);
  const [verifyMockPayment, { isLoading: isVerifying }] = useVerifyMockPaymentMutation();
  const [error, setError] = useState(null);

  const handleOutcome = async (outcome) => {
    // Guard: if payment data somehow isn't loaded yet, do nothing
    // rather than crash - the buttons are only meant to be usable
    // once data has successfully loaded (see the disabled prop below).
    if (!data?.signatures) {
      setError("Payment details are still loading. Please wait a moment and try again.");
      return;
    }

    setError(null);
    const signature = data.signatures[outcome];
    try {
      await verifyMockPayment({ paymentId, outcome, signature }).unwrap();
      navigate(`/order-confirmation/${orderId}`, {
        state: { paymentOutcome: outcome },
      });
    } catch (err) {
      setError(err?.data?.message || "Something went wrong verifying the payment.");
    }
  };

  if (isLoading) {
    return (
      <Container className="py-12 text-center">
        <p className="text-neutral-500">Loading payment...</p>
      </Container>
    );
  }

  if (isError || !data?.payment) {
    return (
      <Container className="py-12 text-center flex flex-col gap-3">
        <h1 className="text-xl font-bold text-black">Payment session not found</h1>
        <p className="text-sm text-neutral-500">
          This payment link may be invalid or expired. Please return to your cart and try
          checking out again.
        </p>
      </Container>
    );
  }

  const payment = data.payment;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Container className="max-w-sm text-center flex flex-col gap-4">
        <div className="border border-neutral-200 rounded-md p-6 bg-white flex flex-col gap-4">
          <p className="text-xs text-accent font-medium uppercase tracking-wide">
            Sandbox Payment Simulation
          </p>
          <h1 className="text-xl font-bold text-black">Complete Your Payment</h1>
          <p className="text-sm text-neutral-500">
            This is a simulated payment page for testing. No real payment is
            processed and no real payment details are used.
          </p>

          <div className="text-sm text-neutral-800 border-t border-neutral-200 pt-3">
            <p>Order: {payment.order?.orderNumber}</p>
            <p className="font-medium">Amount: ${payment.amount}</p>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="primary"
              disabled={isVerifying}
              onClick={() => handleOutcome("success")}
            >
              Simulate Successful Payment
            </Button>
            <Button
              variant="secondary"
              disabled={isVerifying}
              onClick={() => handleOutcome("failure")}
            >
              Simulate Failed Payment
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default MockGatewayPage;