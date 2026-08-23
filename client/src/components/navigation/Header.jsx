import { useState } from "react";
import Container from "../Container";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";
import SearchBar from "../../features/product/SearchBar";
import navigationCategories from "./navigationData";

// Global site header. Search is now functional (Phase 5) via
// SearchBar. Account and cart icons remain non-functional placeholders
// - real behavior arrives in Phase 7 (account) and Phase 8 (cart).
function Header() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="relative border-b border-neutral-200 bg-white">
      <Container className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3 6H19M3 11H19M3 16H19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <span className="text-xl font-bold text-black tracking-wide">
            FASHION CO
          </span>
        </div>

        <nav
          className="hidden lg:flex items-center gap-8"
          onMouseLeave={() => setActiveCategory(null)}
        >
          {navigationCategories.map((category) => (
            <div
              key={category.slug}
              className="relative"
              onMouseEnter={() => setActiveCategory(category.slug)}
            >
              <button
                type="button"
                className="text-sm font-medium text-black hover:text-accent transition-colors"
                onClick={() =>
                  setActiveCategory((prev) =>
                    prev === category.slug ? null : category.slug
                  )
                }
              >
                {category.name}
              </button>
              {activeCategory === category.slug &&
                category.subcategories.length > 0 && (
                  <MegaMenu
                    categoryName={category.name}
                    subcategories={category.subcategories}
                  />
                )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M17 17L13 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
          </div>
          <button type="button" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="6.5"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M3 17c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button type="button" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 7h10l-1 10H6L5 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </Container>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={navigationCategories}
      />
    </header>
  );
}

export default Header;