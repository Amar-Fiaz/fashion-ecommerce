// Mock product data for the Phase 4 homepage. Shape intentionally
// mirrors the fields the real Product model will have (Phase 5), so
// swapping this for real API data later requires minimal changes to
// the components that consume it. `image` is left as an empty string
// on purpose - ProductCard renders a CSS-only placeholder block until
// real product photography (via Cloudinary) exists.

const homepageMockProducts = [
  {
    id: "mock-1",
    name: "Tailored Wool Coat",
    slug: "tailored-wool-coat",
    price: 189,
    salePrice: null,
    image: "",
    isFeatured: true,
    isNewArrival: false,
    isSale: false,
  },
  {
    id: "mock-2",
    name: "Silk Midi Dress",
    slug: "silk-midi-dress",
    price: 129,
    salePrice: null,
    image: "",
    isFeatured: true,
    isNewArrival: true,
    isSale: false,
  },
  {
    id: "mock-3",
    name: "Relaxed Linen Shirt",
    slug: "relaxed-linen-shirt",
    price: 79,
    salePrice: null,
    image: "",
    isFeatured: true,
    isNewArrival: false,
    isSale: false,
  },
  {
    id: "mock-4",
    name: "High-Rise Tailored Trousers",
    slug: "high-rise-tailored-trousers",
    price: 99,
    salePrice: null,
    image: "",
    isFeatured: false,
    isNewArrival: true,
    isSale: false,
  },
  {
    id: "mock-5",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    price: 149,
    salePrice: null,
    image: "",
    isFeatured: false,
    isNewArrival: true,
    isSale: false,
  },
  {
    id: "mock-6",
    name: "Cotton Knit Sweater",
    slug: "cotton-knit-sweater",
    price: 69,
    salePrice: null,
    image: "",
    isFeatured: false,
    isNewArrival: true,
    isSale: false,
  },
  {
    id: "mock-7",
    name: "Classic Denim Jacket",
    slug: "classic-denim-jacket",
    price: 119,
    salePrice: 79,
    image: "",
    isFeatured: false,
    isNewArrival: false,
    isSale: true,
  },
  {
    id: "mock-8",
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    price: 89,
    salePrice: 59,
    image: "",
    isFeatured: false,
    isNewArrival: false,
    isSale: true,
  },
];

export default homepageMockProducts;