// Development-only seed script. Run manually via
// `node src/utils/seedCoupons.js` - no admin coupon management UI
// exists yet (Phase 13), so this is how test coupons get created,
// mirroring the pattern already established in Phase 5/7.

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Coupon = require("../models/Coupon");

const coupons = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 0,
    expiresAt: null,
    usageLimit: null,
    isActive: true,
  },
  {
    code: "SAVE20",
    discountType: "fixed",
    discountValue: 20,
    minOrderValue: 100,
    expiresAt: null,
    usageLimit: 100,
    isActive: true,
  },
  {
    code: "EXPIRED5",
    discountType: "fixed",
    discountValue: 5,
    minOrderValue: 0,
    expiresAt: new Date("2020-01-01"),
    usageLimit: null,
    isActive: true,
  },
];

async function seed() {
  await connectDB();
  await Coupon.deleteMany({});
  await Coupon.insertMany(coupons);
  console.log(`Seed complete: ${coupons.length} coupons.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});