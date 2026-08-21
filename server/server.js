const app = require("./src/app");
const connectDB = require("./src/config/db");
const { PORT } = require("./src/config/env");

// Entry point: connect to the database, then start listening.
// Configuration (app.js) and process startup (server.js) are kept
// separate to avoid tangled responsibilities as the app grows.
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();