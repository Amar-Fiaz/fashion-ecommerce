import { useState } from "react";

// Slide-in drawer navigation for mobile widths. Data-driven from the
// same category data as the desktop mega menu.

function MobileNav({ open, onClose, categories }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-40 shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <span className="text-lg font-semibold text-black">Menu</span>
          <button onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {categories.map((category) => (
            <div key={category.slug}>
              <button
                type="button"
                className="w-full flex items-center justify-between py-2 text-sm font-medium text-black"
                onClick={() =>
                  setExpandedCategory((prev) =>
                    prev === category.slug ? null : category.slug
                  )
                }
              >
                {category.name}
                {category.subcategories.length > 0 && (
                  <span>{expandedCategory === category.slug ? "−" : "+"}</span>
                )}
              </button>
              {expandedCategory === category.slug &&
                category.subcategories.length > 0 && (
                  <ul className="pl-4 flex flex-col gap-2 pb-2">
                    {category.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <span className="text-sm text-neutral-500">
                          {sub.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

export default MobileNav;