// Desktop mega menu dropdown panel. Fully data-driven - renders
// whatever subcategories it's given, with no knowledge of where the
// data comes from. This means swapping mock data for real API data
// in Phase 5 requires no changes here.

function MegaMenu({ categoryName, subcategories }) {
  return (
    <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-neutral-200 rounded-md shadow-lg p-4 z-20">
      <p className="text-xs font-medium text-neutral-500 mb-2">{categoryName}</p>
      <ul className="flex flex-col gap-2">
        {subcategories.map((sub) => (
          <li key={sub.slug}>
            {/* Placeholder only - becomes a real link once category
                listing routes exist (Phase 5). */}
            <span className="text-sm text-neutral-800 hover:text-accent cursor-pointer">
              {sub.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MegaMenu;