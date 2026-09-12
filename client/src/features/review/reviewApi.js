import { apiSlice } from "../../api/apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (productId) => `/reviews/${productId}`,
      providesTags: (result, error, productId) => [{ type: "Reviews", id: productId }],
    }),
    getReviewEligibility: builder.query({
      query: (productId) => `/reviews/${productId}/eligibility`,
    }),
    createReview: builder.mutation({
      query: ({ productId, ...body }) => ({
        url: `/reviews/${productId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Reviews", id: productId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReviewsQuery,
  useGetReviewEligibilityQuery,
  useCreateReviewMutation,
} = reviewApi;