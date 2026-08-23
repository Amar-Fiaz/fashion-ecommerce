const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

function ProductSort({ value, onChange }) {
  return (
    <select
      value={value || "newest"}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-sm border border-neutral-200 text-sm outline-none focus:border-black"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default ProductSort;