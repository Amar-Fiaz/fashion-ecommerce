import { useGetCategoriesQuery } from "./productApi";

// Fixed reference lists for size/color filters - there's no
// "available filter values" endpoint (not required by Phase 5
// scope), so these are a reasonable static list matching the seed
// data's variant values.
const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Ivory", "Camel", "Tan", "Grey", "Blue"];

// Filter panel. Category data comes from the real API; the parent
// ProductListingPage owns filter state via the URL query string, so
// this component just reads `filters` and calls `onChange`.
function ProductFilters({ filters, onChange }) {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.categories || [];

  const selectedCategory = categories.find((c) => c._id === filters.category);

  const update = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="flex flex-col gap-6 w-full lg:w-56 shrink-0">
      <div>
        <h3 className="text-sm font-semibold text-black mb-2">Category</h3>
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : (
          <select
            value={filters.category || ""}
            onChange={(e) =>
              onChange({ ...filters, category: e.target.value, subCategory: "", page: 1 })
            }
            className="w-full px-3 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-black mb-2">Subcategory</h3>
          <select
            value={filters.subCategory || ""}
            onChange={(e) => update("subCategory", e.target.value)}
            className="w-full px-3 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
          >
            <option value="">All</option>
            {selectedCategory.subcategories.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-black mb-2">Brand</h3>
        <input
          type="text"
          value={filters.brand || ""}
          onChange={(e) => update("brand", e.target.value)}
          placeholder="e.g. Fashion Co"
          className="w-full px-3 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-black mb-2">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            value={filters.minPrice || ""}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder="Min"
            className="w-full px-2 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
          />
          <span className="text-neutral-500">–</span>
          <input
            type="number"
            min="0"
            value={filters.maxPrice || ""}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder="Max"
            className="w-full px-2 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-black mb-2">Size</h3>
        <select
          value={filters.size || ""}
          onChange={(e) => update("size", e.target.value)}
          className="w-full px-3 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
        >
          <option value="">All Sizes</option>
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-black mb-2">Color</h3>
        <select
          value={filters.color || ""}
          onChange={(e) => update("color", e.target.value)}
          className="w-full px-3 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
        >
          <option value="">All Colors</option>
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => onChange({ page: 1 })}
        className="text-sm text-neutral-500 hover:text-black text-left"
      >
        Clear all filters
      </button>
    </div>
  );
}

export default ProductFilters;