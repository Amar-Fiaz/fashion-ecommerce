// Development-only CLI script. NOT part of the running application -
// run manually to create an admin user, since no admin dashboard UI
// exists yet (Phase 12). Usage:
//   node src/utils/createAdmin.js <name> <email> <password>

const connectDB = require("../config/db");
const User = require("../models/User");
const { hashPassword } = require("../utils/password");
const mongoose = require("mongoose");

async function createAdmin() {
  const [, , name, email, password] = process.argv;

  if (!name || !email || !password) {
    console.error("Usage: node src/utils/createAdmin.js <name> <email> <password>");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error(`A user with email ${email} already exists.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const hashedPassword = await hashPassword(password);

  await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: "admin",
    isEmailVerified: true, // admin accounts created this way skip verification
  });

  console.log(`Admin user created: ${email}`);
  await mongoose.disconnect();
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});