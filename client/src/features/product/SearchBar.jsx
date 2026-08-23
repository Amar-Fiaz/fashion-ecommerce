import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyGetSearchSuggestionsQuery } from "./productApi";

// Search input with debounced live suggestions, using the backend's
// regex-based suggestions endpoint. Submitting (Enter, or clicking a
// suggestion) navigates to /shop with the search term applied.
function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [triggerSuggestions, { data, isFetching }] = useLazyGetSearchSuggestionsQuery();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) return;

    debounceRef.current = setTimeout(() => {
      triggerSuggestions(query.trim());
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, triggerSuggestions]);

  const goToResults = (term) => {
    if (!term.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(term.trim())}`);
    onClose();
  };

  const suggestions = data?.suggestions || [];

  return (
    <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white border border-neutral-200 rounded-md shadow-lg p-3 z-30">
      <input
        autoFocus
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") goToResults(query);
          if (e.key === "Escape") onClose();
        }}
        placeholder="Search products..."
        className="w-full px-3 py-2 rounded-sm border border-neutral-200 text-base outline-none focus:border-black"
      />
      {isFetching && <p className="text-sm text-neutral-500 mt-2">Searching...</p>}
      {!isFetching && suggestions.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {suggestions.map((product) => (
            <li key={product.slug}>
              <button
                type="button"
                className="w-full text-left text-sm text-neutral-800 hover:text-accent py-1"
                onClick={() => goToResults(product.name)}
              >
                {product.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {!isFetching && query.trim().length >= 2 && suggestions.length === 0 && (
        <p className="text-sm text-neutral-500 mt-2">No matches found.</p>
      )}
    </div>
  );
}

export default SearchBar;