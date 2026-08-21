// Handles the health-check request. Proves the layered
// routes -> controllers pattern works before any real feature
// depends on it.
function getHealth(req, res) {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
}

module.exports = { getHealth };