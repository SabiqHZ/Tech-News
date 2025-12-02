// server/api/[...slug].js
const app = require("../src/app");

// Vercel akan mengirim SEMUA request /api/* ke file ini
module.exports = (req, res) => {
  return app(req, res);
};
