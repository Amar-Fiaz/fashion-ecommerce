import { apiSlice } from "../../api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation({
      query: (itemId) => ({ url: `/cart/items/${itemId}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    mergeCart: builder.mutation({
      query: (items) => ({ url: "/cart/merge", method: "POST", body: { items } }),
      invalidatesTags: ["Cart"],
    }),
    getWishlist: builder.query({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),
    addWishlistItem: builder.mutation({
      query: (productId) => ({ url: "/wishlist", method: "POST", body: { productId } }),
      invalidatesTags: ["Wishlist"],
    }),
    removeWishlistItem: builder.mutation({
      query: (productId) => ({ url: `/wishlist/${productId}`, method: "DELETE" }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useMergeCartMutation,
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
} = cartApi;