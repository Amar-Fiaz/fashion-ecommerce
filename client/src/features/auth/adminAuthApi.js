import { apiSlice } from "../../api/apiSlice";
import { setAdminCredentials, clearAdminCredentials } from "./adminAuthSlice";

export const adminAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (body) => ({ url: "/admin/auth/login", method: "POST", body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdminCredentials({ user: data.user, accessToken: data.accessToken }));
        } catch {
          // handled by the calling component
        }
      },
    }),
    adminLogout: builder.mutation({
      query: () => ({ url: "/admin/auth/logout", method: "POST" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearAdminCredentials());
        }
      },
    }),
    adminRefresh: builder.mutation({
      query: () => ({ url: "/admin/auth/refresh", method: "POST" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminRefreshMutation,
} = adminAuthApi;