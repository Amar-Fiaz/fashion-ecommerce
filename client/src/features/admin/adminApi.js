import { apiSlice } from "../../api/apiSlice";

// Endpoint name starts with "admin" so apiSlice's prepareHeaders
// correctly attaches the admin access token, not the customer one.
export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminDashboardOverview: builder.query({
      query: () => "/admin/dashboard/overview",
    }),
  }),
  overrideExisting: false,
});

export const { useAdminDashboardOverviewQuery } = adminApi;