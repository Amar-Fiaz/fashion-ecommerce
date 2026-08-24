import { useState } from "react";

// Generic static size chart, shared across all products regardless
// of category. Illustrative measurements only - not tied to any real
// per-product data, per the approved Phase 6 decision.
const SIZE_CHART = [
  { size: "XS", chest: "32-33", waist: "24-25", hip: "34-35" },
  { size: "S", chest: "34-35", waist: "26-27", hip: "36-37" },
  { size: "M", chest: "36-37", waist: "28-29", hip: "38-39" },
  { size: "L", chest: "38-40", waist: "30-32", hip: "40-42" },
  { size: "XL", chest: "41-43", waist: "33-35", hip: "43-45" },
];

function SizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm text-neutral-500 underline hover:text-black"
      >
        {open ? "Hide size guide" : "View size guide"}
      </button>

      {open && (
        <div className="mt-3 border border-neutral-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-black">Size</th>
                <th className="text-left px-3 py-2 font-medium text-black">
                  Chest (in)
                </th>
                <th className="text-left px-3 py-2 font-medium text-black">
                  Waist (in)
                </th>
                <th className="text-left px-3 py-2 font-medium text-black">
                  Hip (in)
                </th>
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="border-t border-neutral-200">
                  <td className="px-3 py-2 text-neutral-800">{row.size}</td>
                  <td className="px-3 py-2 text-neutral-500">{row.chest}</td>
                  <td className="px-3 py-2 text-neutral-500">{row.waist}</td>
                  <td className="px-3 py-2 text-neutral-500">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-neutral-500 px-3 py-2">
            General reference chart. Fit may vary by style.
          </p>
        </div>
      )}
    </div>
  );
}

export default SizeGuide;