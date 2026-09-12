import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useApplyCouponMutation } from "./couponApi";

// Preview only - the real, authoritative discount is recalculated
// identically inside order creation itself (order.service.js), so
// this can never be trusted alone for the actual charge, matching
// the same pattern already established for the shipping preview.
function CouponField({ subtotal, onApplied, appliedCoupon }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [applyCoupon, { isLoading }] = useApplyCouponMutation();

  const handleApply = async () => {
    setError(null);
    if (!code.trim()) return;
    try {
      const result = await applyCoupon({ code, subtotal }).unwrap();
      onApplied(result);
    } catch (err) {
      setError(err?.data?.message || "Invalid coupon code");
      onApplied(null);
    }
  };

  const handleRemove = () => {
    setCode("");
    setError(null);
    onApplied(null);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between text-sm bg-neutral-50 border border-neutral-200 rounded-sm px-3 py-2">
        <span className="text-success">
          Coupon <span className="font-medium">{appliedCoupon.code}</span>{" "}
          applied
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className="text-neutral-500 hover:text-black"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 w-full">
        <Input
          id="coupon-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon code"
          className="min-w-0 w-full"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handleApply}
          disabled={isLoading}
          className="whitespace-nowrap"
        >
          {isLoading ? "..." : "Apply"}
        </Button>
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

export default CouponField;
