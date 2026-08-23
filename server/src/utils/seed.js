// Development-only seed script. NOT part of the running application -
// run manually via `node src/utils/seed.js` to populate MongoDB with
// sample categories, subcategories, and products for local testing.
// Safe to re-run: it clears existing Category/SubCategory/Product
// documents before inserting fresh data.

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");

// Reuses the same taxonomy as the Phase 3 mock navigation data
// (client/src/components/navigation/navigationData.js), per the
// approved Phase 5 decision.
const categoryData = [
  {
    name: "Women",
    slug: "women",
    subcategories: ["Dresses", "Tops", "Bottoms", "Outerwear", "Shoes"],
  },
  {
    name: "Men",
    slug: "men",
    subcategories: ["Shirts", "T-Shirts", "Bottoms", "Outerwear", "Shoes"],
  },
  {
    name: "Kids",
    slug: "kids",
    subcategories: ["Girls", "Boys", "Baby"],
  },
  {
    name: "Accessories",
    slug: "accessories",
    subcategories: ["Bags", "Jewelry", "Belts", "Sunglasses"],
  },
  {
    name: "Sale",
    slug: "sale",
    subcategories: [],
  },
];

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "-");
}

async function seed() {
  await connectDB();

  console.log("Clearing existing Category, SubCategory, and Product data...");
  await Product.deleteMany({});
  await SubCategory.deleteMany({});
  await Category.deleteMany({});

  console.log("Seeding categories and subcategories...");
  const subCategoryMap = {}; // slug -> subCategory document, for product seeding below

  for (const cat of categoryData) {
    const category = await Category.create({ name: cat.name, slug: cat.slug });

    for (const subName of cat.subcategories) {
      const subSlug = slugify(subName);
      const subCategory = await SubCategory.create({
        name: subName,
        slug: subSlug,
        category: category._id,
      });
      subCategoryMap[`${cat.slug}:${subSlug}`] = subCategory;
    }
  }

  console.log("Seeding products...");

  const women = await Category.findOne({ slug: "women" });
  const men = await Category.findOne({ slug: "men" });

  const products = [
    {
      name: "Tailored Wool Coat",
      slug: "tailored-wool-coat",
      description: "A structured wool coat with a tailored silhouette, made for cold-weather layering.",
      price: 189,
      salePrice: null,
      category: women._id,
      subCategory: subCategoryMap["women:outerwear"]._id,
      brand: "Fashion Co",
      variants: [
        { size: "S", color: "Black", stock: 12, sku: "TWC-S-BLK" },
        { size: "M", color: "Black", stock: 8, sku: "TWC-M-BLK" },
        { size: "L", color: "Camel", stock: 5, sku: "TWC-L-CML" },
      ],
      tags: ["coat", "wool", "outerwear", "winter"],
      isFeatured: true,
    },
    {
      name: "Silk Midi Dress",
      slug: "silk-midi-dress",
      description: "A fluid silk midi dress with a flattering drape, suitable for both day and evening.",
      price: 129,
      salePrice: null,
      category: women._id,
      subCategory: subCategoryMap["women:dresses"]._id,
      brand: "Fashion Co",
      variants: [
        { size: "S", color: "Ivory", stock: 10, sku: "SMD-S-IVR" },
        { size: "M", color: "Ivory", stock: 7, sku: "SMD-M-IVR" },
      ],
      tags: ["dress", "silk", "midi"],
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: "Relaxed Linen Shirt",
      slug: "relaxed-linen-shirt",
      description: "A breathable, relaxed-fit linen shirt for warm-weather wear.",
      price: 79,
      salePrice: null,
      category: women._id,
      subCategory: subCategoryMap["women:tops"]._id,
      brand: "Fashion Co",
      variants: [
        { size: "S", color: "White", stock: 15, sku: "RLS-S-WHT" },
        { size: "M", color: "White", stock: 15, sku: "RLS-M-WHT" },
      ],
      tags: ["shirt", "linen", "top"],
      isFeatured: true,
    },
    {
      name: "High-Rise Tailored Trousers",
      slug: "high-rise-tailored-trousers",
      description: "High-rise trousers with a tailored straight leg.",
      price: 99,
      salePrice: null,
      category: women._id,
      subCategory: subCategoryMap["women:bottoms"]._id,
      brand: "Fashion Co",
      variants: [
        { size: "S", color: "Black", stock: 9, sku: "HRT-S-BLK" },
        { size: "M", color: "Black", stock: 6, sku: "HRT-M-BLK" },
      ],
      tags: ["trousers", "tailored"],
      isNewArrival: true,
    },
    {
      name: "Leather Crossbody Bag",
      slug: "leather-crossbody-bag",
      description: "A compact leather crossbody bag with an adjustable strap.",
      price: 149,
      salePrice: null,
      category: (await Category.findOne({ slug: "accessories" }))._id,
      subCategory: subCategoryMap["accessories:bags"]._id,
      brand: "Fashion Co",
      variants: [{ size: "One Size", color: "Tan", stock: 20, sku: "LCB-OS-TAN" }],
      tags: ["bag", "leather", "accessories"],
      isNewArrival: true,
    },
    {
      name: "Cotton Knit Sweater",
      slug: "cotton-knit-sweater",
      description: "A soft cotton knit sweater with a classic crew neck.",
      price: 69,
      salePrice: null,
      category: men._id,
      subCategory: subCategoryMap["men:t-shirts"]._id,
      brand: "Fashion Co",
      variants: [
        { size: "M", color: "Grey", stock: 14, sku: "CKS-M-GRY" },
        { size: "L", color: "Grey", stock: 11, sku: "CKS-L-GRY" },
      ],
      tags: ["sweater", "knit"],
      isNewArrival: true,
    },
    {
      name: "Classic Denim Jacket",
      slug: "classic-denim-jacket",
      description: "A timeless denim jacket with a slightly oversized fit.",
      price: 119,
      salePrice: 79,
      category: men._id,
      subCategory: subCategoryMap["men:outerwear"]._id,
      brand: "Fashion Co",
      variants: [
        { size: "M", color: "Blue", stock: 6, sku: "CDJ-M-BLU" },
        { size: "L", color: "Blue", stock: 4, sku: "CDJ-L-BLU" },
      ],
      tags: ["jacket", "denim", "outerwear"],
      isSale: true,
    },
    {
      name: "Pleated Midi Skirt",
      slug: "pleated-midi-skirt",
      description: "A pleated midi skirt with a fluid movement.",
      price: 89,
      salePrice: 59,
      category: women._id,
      subCategory: subCategoryMap["women:bottoms"]._id,
      brand: "Fashion Co",
      variants: [
        { size: "S", color: "Black", stock: 8, sku: "PMS-S-BLK" },
        { size: "M", color: "Black", stock: 5, sku: "PMS-M-BLK" },
      ],
      tags: ["skirt", "pleated"],
      isSale: true,
    },
  ];

  await Product.insertMany(products);

  console.log(`Seed complete: ${categoryData.length} categories, ${products.length} products.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});