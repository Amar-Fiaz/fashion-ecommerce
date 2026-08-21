import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config/env";

// Single RTK Query base API slice for all server-state communication.
// Feature-specific endpoints are injected into this slice via
// injectEndpoints() starting in later phases (e.g. Phase 5 - products).
// Phase 1 only defines the health check endpoint, to prove the
// full client-server pipeline works end-to-end.
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getHealth: builder.query({
      query: () => "/health",
    }),
  }),
});

export const { useGetHealthQuery } = apiSlice;