function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 text-sm text-neutral-800 disabled:text-neutral-300 disabled:pointer-events-none"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`px-3 py-1 text-sm rounded-sm ${
            p === page ? "bg-black text-white" : "text-neutral-800 hover:bg-neutral-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 text-sm text-neutral-800 disabled:text-neutral-300 disabled:pointer-events-none"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;