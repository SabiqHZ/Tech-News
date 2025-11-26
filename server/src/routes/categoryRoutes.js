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

    if (error) {
      console.error("❌ Supabase error /categories:", error);
      throw error;
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Error get /api/categories:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kategori",
    });
  }
});

// GET /api/categories/:id/articles
router.get("/:id/articles", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
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
      console.error("❌ Supabase error /categories/:id:", catError);
      throw catError;
    }

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

    if (artError) {
      console.error("❌ Supabase error /categories/:id/articles:", artError);
      throw artError;
    }

    res.json({
      success: true,
      category,
      data: articles,
    });
  } catch (err) {
    console.error("❌ Error get /api/categories/:id/articles:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil artikel kategori",
    });
  }
});

module.exports = router;
