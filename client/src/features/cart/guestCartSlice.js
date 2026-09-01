import { createSlice } from "@reduxjs/toolkit";
import { getGuestCart, saveGuestCart, clearGuestCart } from "./guestCart";

// Guest cart items shape: { productId, variantSku, size, color,
// quantity, name, slug, price, salePrice, image, availableStock }.
// Product display fields (name, price, image, etc.) are captured at
// add-to-cart time from the already-loaded product detail page, since
// there is no backend to look them up for a guest cart. Stock is
// re-validated against live data at merge time and at checkout
// (Phase 9) regardless.
const initialState = {
  items: getGuestCart(),
};

function findIndex(items, productId, variantSku) {
  return items.findIndex(
    (item) => item.productId === productId && item.variantSku === variantSku
  );
}

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState,
  reducers: {
    addGuestItem(state, action) {
      const newItem = action.payload;
      const index = findIndex(state.items, newItem.productId, newItem.variantSku);

      if (index >= 0) {
        const requestedTotal = state.items[index].quantity + newItem.quantity;
        state.items[index].quantity = Math.min(requestedTotal, newItem.availableStock);
      } else {
        state.items.push(newItem);
      }
      saveGuestCart(state.items);
    },
    updateGuestItemQuantity(state, action) {
      const { productId, variantSku, quantity } = action.payload;
      const index = findIndex(state.items, productId, variantSku);
      if (index >= 0) {
        state.items[index].quantity = quantity;
        saveGuestCart(state.items);
      }
    },
    removeGuestItem(state, action) {
      const { productId, variantSku } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.productId === productId && item.variantSku === variantSku)
      );
      saveGuestCart(state.items);
    },
    clearGuestItems(state) {
      state.items = [];
      clearGuestCart();
    },
  },
});

export const {
  addGuestItem,
  updateGuestItemQuantity,
  removeGuestItem,
  clearGuestItems,
} = guestCartSlice.actions;
export default guestCartSlice.reducer;