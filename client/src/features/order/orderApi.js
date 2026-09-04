import { apiSlice } from "../../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    getMyOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation, useGetMyOrdersQuery, useGetOrderByIdQuery } = orderApi;