import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config/env";
import { setCredentials, clearCredentials } from "../features/auth/authSlice";
import { setAdminCredentials, clearAdminCredentials } from "../features/auth/adminAuthSlice";

const rawBaseQuery = fetchBaseQuery({
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
});

const REFRESH_ENDPOINT_NAMES = ["refreshUser", "adminRefresh"];

async function baseQueryWithReauth(args, apiState, extraOptions) {
  const result = await rawBaseQuery(args, apiState, extraOptions);

  const isRefreshCall = REFRESH_ENDPOINT_NAMES.includes(apiState.endpoint);

  if (result.error && result.error.status === 401 && !isRefreshCall) {
    const isAdminEndpoint = apiState.endpoint.toLowerCase().startsWith("admin");
    const refreshUrl = isAdminEndpoint ? "/admin/auth/refresh" : "/auth/refresh";

    const refreshResult = await rawBaseQuery(
      { url: refreshUrl, method: "POST" },
      apiState,
      extraOptions
    );

    if (refreshResult.data) {
      if (isAdminEndpoint) {
        apiState.dispatch(
          setAdminCredentials({
            user: refreshResult.data.user,
            accessToken: refreshResult.data.accessToken,
          })
        );
      } else {
        apiState.dispatch(
          setCredentials({
            user: refreshResult.data.user,
            accessToken: refreshResult.data.accessToken,
          })
        );
      }
      return rawBaseQuery(args, apiState, extraOptions);
    }

    if (isAdminEndpoint) {
      apiState.dispatch(clearAdminCredentials());
    } else {
      apiState.dispatch(clearCredentials());
    }
  }

  return result;
}

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Profile", "Addresses", "Cart", "Wishlist"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getHealth: builder.query({
      query: () => "/health",
    }),
  }),
});

export const { useGetHealthQuery } = apiSlice;