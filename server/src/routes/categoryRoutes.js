const express = require("express");
const router = express.Router();
const supabase = require("../config/db");

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name", { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Error GET /api/categories:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kategori",
    });
  }
});

// GET /api/categories/:id/articles
router.get("/:id/articles", async (req, res) => {
  const id = Number(req.params.id);

  try {
    // cek kategori
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("id", id)
      .single();

    if (catError) {
      if (catError.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Kategori tidak ditemukan",
        });
      }
      throw catError;
    }

    // ambil artikel di kategori tsb
    const { data: articles, error: artError } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        thumbnail_url,
        content,
        author,
        published_at
      `
      )
      .eq("category_id", id)
      .order("published_at", { ascending: false });

    if (artError) throw artError;

    res.json({
      success: true,
      category,
      data: articles || [],
    });
  } catch (err) {
    console.error(
      "Error GET /api/categories/:id/articles:",
      err.message || err
    );
    res.status(500).json({
      success: false,
      message: "Gagal mengambil artikel kategori",
    });
  }
});

module.exports = router;
