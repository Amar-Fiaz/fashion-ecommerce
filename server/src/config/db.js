const mongoose = require("mongoose");
const { MONGODB_URI } = require("./env");

// Establishes the MongoDB connection using MONGODB_URI from the
// environment. No models or schemas are defined in Phase 1 - this
// only proves connectivity, per docs/DATABASE.md's phase-gated
// model creation rule.
async function connectDB() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Cannot connect to the database.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;