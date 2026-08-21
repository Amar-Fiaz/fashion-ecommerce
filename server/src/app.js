const express = require("express");
const cors = require("cors");
const { CLIENT_URL } = require("./config/env");
const healthRoutes = require("./routes/health.routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// CORS: explicit allowed origin from CLIENT_URL, not a wildcard.
// credentials: true is enabled now because the already-approved
// Phase 7 httpOnly refresh-token cookie flow requires it - this
// avoids revisiting CORS configuration later.
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/health", healthRoutes);

// 404 handler for unmatched routes, then the centralized error handler.
// errorHandler must be registered last.
app.use(notFound);
app.use(errorHandler);

module.exports = app;