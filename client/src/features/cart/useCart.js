import { useSelector, useDispatch } from "react-redux";
import {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "./cartApi";
import { addGuestItem, updateGuestItemQuantity, removeGuestItem } from "./guestCartSlice";

// Unified cart interface for both guest and authenticated users, so
// UI components (MiniCart, CartPage, VariantSelector) don't need to
// branch on auth state themselves. Guest items and authenticated
// cart items are normalized to the same shape here.
export function useCart() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(accessToken);
  const guestItems = useSelector((state) => state.guestCart.items);

  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addCartItem] = useAddCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  let items = [];
  let subtotal = 0;

  if (isAuthenticated) {
    items = (cartData?.cart?.items || []).map((item) => ({
      id: item._id, // backend item id, used for update/remove
      productId: item.product?._id,
      variantSku: item.variantSku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      name: item.product?.name,
      slug: item.product?.slug,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      image: item.product?.image,
      availableStock: item.availableStock,
      insufficientStock: item.insufficientStock,
    }));
    subtotal = cartData?.cart?.subtotal || 0;
  } else {
    items = guestItems.map((item) => ({
      id: `${item.productId}-${item.variantSku}`, // synthetic id for guest items
      ...item,
      unitPrice: item.salePrice || item.price,
      lineTotal: (item.salePrice || item.price) * item.quantity,
    }));
    subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  async function addItem({ product, variant, quantity }) {
    if (isAuthenticated) {
      await addCartItem({
        productId: product._id,
        variantSku: variant.sku,
        quantity,
      }).unwrap();
    } else {
      dispatch(
        addGuestItem({
          productId: product._id,
          variantSku: variant.sku,
          size: variant.size,
          color: variant.color,
          quantity,
          name: product.name,
          slug: product.slug,
          price: product.price,
          salePrice: product.isSale ? product.salePrice : null,
          image: product.images?.[0] || "",
          availableStock: variant.stock,
        })
      );
    }
  }

  async function updateQuantity(item, quantity) {
    if (isAuthenticated) {
      await updateCartItem({ itemId: item.id, quantity }).unwrap();
    } else {
      dispatch(
        updateGuestItemQuantity({
          productId: item.productId,
          variantSku: item.variantSku,
          quantity,
        })
      );
    }
  }

  async function removeItem(item) {
    if (isAuthenticated) {
      await removeCartItem(item.id).unwrap();
    } else {
      dispatch(removeGuestItem({ productId: item.productId, variantSku: item.variantSku }));
    }
  }

  return {
    items,
    subtotal,
    itemCount,
    isLoading: isAuthenticated && cartLoading,
    isAuthenticated,
    addItem,
    updateQuantity,
    removeItem,
  };
}