// server/src/app.js
const express = require("express");
const cors = require("cors");

const articleRoutes = require("./routes/articleRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const supabase = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Tech News API running" });
});

// health supabase (opsional)
app.get("/api/health", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase error /api/health:", error);
      throw error;
    }

    res.json({
      ok: true,
      sampleCategoryId: data?.[0]?.id ?? null,
    });
  } catch (err) {
    console.error("Error /api/health", err);
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);

module.exports = app;
