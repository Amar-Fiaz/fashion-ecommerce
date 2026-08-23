import { apiSlice } from "../../api/apiSlice";

// Catalog-related RTK Query endpoints, injected into the shared base
// API slice. Kept in features/product/ since this is product-domain
// logic, per ARCHITECTURE.md's feature-based frontend structure.
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
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useLazyGetSearchSuggestionsQuery,
  useGetCategoriesQuery,
} = productApi;