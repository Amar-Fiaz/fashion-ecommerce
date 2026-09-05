import { apiSlice } from "../../api/apiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMockPayment: builder.query({
      query: (paymentId) => `/payments/mock/${paymentId}`,
    }),
    verifyMockPayment: builder.mutation({
      query: (body) => ({ url: "/payments/mock/verify", method: "POST", body }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetMockPaymentQuery, useVerifyMockPaymentMutation } = paymentApi;