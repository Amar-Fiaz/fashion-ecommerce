// Centralized access to frontend environment variables.
// All Vite env vars must be prefixed with VITE_ to be exposed to client code.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  // Fails loudly in development if the required env var is missing,
  // rather than silently making requests to an undefined base URL.
  console.warn(
    "VITE_API_BASE_URL is not set. Create a .env file based on .env.example."
  );
}