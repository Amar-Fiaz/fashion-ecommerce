import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config/env";

// credentials: "include" ensures the httpOnly refreshToken /
// adminRefreshToken cookies are sent and received on cross-port
// requests during development (client on 5173, server on 5000).
//
// prepareHeaders attaches the correct in-memory access token based on
// which slice of auth the endpoint belongs to - admin endpoints (by
// naming convention, e.g. "adminLogin") use adminAuth's token,
// everything else uses the customer auth token. This keeps the two
// tokens from ever crossing into the wrong request.
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const state = getState();
      const isAdminEndpoint = endpoint.toLowerCase().startsWith("admin");
      const token = isAdminEndpoint
        ? state.adminAuth?.accessToken
        : state.auth?.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getHealth: builder.query({
      query: () => "/health",
    }),
  }),
});

export const { useGetHealthQuery } = apiSlice;