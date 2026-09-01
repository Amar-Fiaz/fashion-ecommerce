import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import authReducer from "../features/auth/authSlice";
import adminAuthReducer from "../features/auth/adminAuthSlice";
import guestCartReducer from "../features/cart/guestCartSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    adminAuth: adminAuthReducer,
    guestCart: guestCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});