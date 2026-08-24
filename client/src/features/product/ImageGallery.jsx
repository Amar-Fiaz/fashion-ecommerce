import { useState } from "react";

// Product image gallery with a main image and thumbnail strip.
// Products currently have empty `images` arrays (no Cloudinary
// upload flow exists yet), so this gracefully renders a single
// placeholder block when no images are present - same visual
// language as ProductCard's placeholder.
function ImageGallery({ images = [], productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-neutral-50 border border-neutral-200 rounded-md flex items-center justify-center">
        <span className="text-sm text-neutral-500">Image placeholder</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[3/4] w-full bg-neutral-50 border border-neutral-200 rounded-md overflow-hidden">
        <img
          src={images[activeIndex]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`w-16 h-16 rounded-sm overflow-hidden border ${
                i === activeIndex ? "border-black" : "border-neutral-200"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;