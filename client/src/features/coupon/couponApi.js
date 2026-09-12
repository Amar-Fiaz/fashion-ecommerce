import { apiSlice } from "../../api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyCoupon: builder.mutation({
      query: (body) => ({ url: "/coupons/apply", method: "POST", body }),
    }),
  }),
  overrideExisting: false,
});

export const { useApplyCouponMutation } = couponApi;