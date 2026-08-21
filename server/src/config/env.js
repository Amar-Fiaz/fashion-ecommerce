require("dotenv").config();

// Centralized access to backend environment variables.
// Warns loudly at startup if a required variable is missing,
// rather than letting the app run in an undefined state.
const required = ["PORT", "MONGODB_URI", "NODE_ENV", "CLIENT_URL"];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(
      `Environment variable ${key} is not set. Check your .env file against .env.example.`
    );
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL,
};