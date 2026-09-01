import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMergeCartMutation } from "./cartApi";
import { clearGuestItems } from "./guestCartSlice";

// Watches for the transition from logged-out to logged-in, and if the
// guest cart has items at that moment, merges them into the backend
// cart (Step 1's /cart/merge endpoint), then clears the guest cart.
// Runs once per login transition, not on every render - a ref tracks
// whether a merge has already been attempted for the current session
// to avoid duplicate merge calls (e.g. from React StrictMode's
// double-invoke in development, or multiple components mounting).
export function useMergeCartOnLogin() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const guestItems = useSelector((state) => state.guestCart.items);
  const [mergeCart] = useMergeCartMutation();
  const hasMergedRef = useRef(false);
  const wasAuthenticatedRef = useRef(Boolean(accessToken));

  useEffect(() => {
    const justLoggedIn = accessToken && !wasAuthenticatedRef.current;
    wasAuthenticatedRef.current = Boolean(accessToken);

    if (!justLoggedIn || hasMergedRef.current) return;

    if (guestItems.length > 0) {
      hasMergedRef.current = true;
      const payload = guestItems.map((item) => ({
        productId: item.productId,
        variantSku: item.variantSku,
        quantity: item.quantity,
      }));
      mergeCart(payload)
        .unwrap()
        .then(() => {
          dispatch(clearGuestItems());
        })
        .catch(() => {
          // If the merge fails (e.g. a product no longer exists),
          // the guest cart is intentionally left intact rather than
          // silently discarding items the merge couldn't process.
          hasMergedRef.current = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
}