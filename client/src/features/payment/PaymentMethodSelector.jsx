const PAYMENT_METHODS = [
  {
    value: "cod",
    label: "Cash on Delivery",
    description: "Pay with cash when your order arrives.",
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "Transfer payment manually using the account details provided after checkout.",
  },
  {
    value: "mock_gateway",
    label: "Pay Online (Sandbox)",
    description:
      "Simulated online payment for testing - no real transaction occurs, no real payment details are used.",
  },
];

function PaymentMethodSelector({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      {PAYMENT_METHODS.map((method) => (
        <label
          key={method.value}
          className="flex items-start gap-2 border border-neutral-200 rounded-md p-3 text-sm cursor-pointer"
        >
          <input
            type="radio"
            name="paymentMethod"
            checked={value === method.value}
            onChange={() => onChange(method.value)}
            className="mt-0.5"
          />
          <span>
            <span className="block font-medium text-black">{method.label}</span>
            <span className="block text-neutral-500 text-xs">{method.description}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export default PaymentMethodSelector;