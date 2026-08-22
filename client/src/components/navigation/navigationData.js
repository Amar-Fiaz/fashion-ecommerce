// Mock category/subcategory data for Phase 3. This shape intentionally
// mirrors what the real Category/SubCategory models will look like
// once they're built in Phase 5, so replacing this with real API data
// later requires minimal changes to the components that consume it.

const navigationCategories = [
  {
    name: "Women",
    slug: "women",
    subcategories: [
      { name: "Dresses", slug: "dresses" },
      { name: "Tops", slug: "tops" },
      { name: "Bottoms", slug: "bottoms" },
      { name: "Outerwear", slug: "outerwear" },
      { name: "Shoes", slug: "shoes" },
    ],
  },
  {
    name: "Men",
    slug: "men",
    subcategories: [
      { name: "Shirts", slug: "shirts" },
      { name: "T-Shirts", slug: "t-shirts" },
      { name: "Bottoms", slug: "bottoms" },
      { name: "Outerwear", slug: "outerwear" },
      { name: "Shoes", slug: "shoes" },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    subcategories: [
      { name: "Girls", slug: "girls" },
      { name: "Boys", slug: "boys" },
      { name: "Baby", slug: "baby" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    subcategories: [
      { name: "Bags", slug: "bags" },
      { name: "Jewelry", slug: "jewelry" },
      { name: "Belts", slug: "belts" },
      { name: "Sunglasses", slug: "sunglasses" },
    ],
  },
  {
    name: "Sale",
    slug: "sale",
    subcategories: [],
  },
];

export default navigationCategories;