import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

// Global Redux store. In Phase 1 this only registers the RTK Query
// API slice's reducer and middleware - there is no plain UI state
// (modals, filters, etc.) to manage until later phases.
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});