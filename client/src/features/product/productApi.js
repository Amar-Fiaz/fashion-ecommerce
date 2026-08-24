import { apiSlice } from "../../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
    }),
    getSearchSuggestions: builder.query({
      query: (q) => ({
        url: "/products/search-suggestions",
        params: { q },
      }),
    }),
    getCategories: builder.query({
      query: () => "/categories",
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/products/${slug}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useLazyGetSearchSuggestionsQuery,
  useGetCategoriesQuery,
  useGetProductBySlugQuery,
} = productApi;