const express = require("express");
const router = express.Router();
const supabase = require("../config/db");

// GET /api/articles
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        thumbnail_url,
        content,
        author,
        published_at,
        category_id,
        categories (
          name,
          slug
        )
      `
      )
      .order("published_at", { ascending: false });

    if (error) throw error;

    const mapped = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      thumbnail_url: row.thumbnail_url,
      content: row.content,
      author: row.author,
      published_at: row.published_at,
      category_id: row.category_id,
      category_name: row.categories?.name || null,
      category_slug: row.categories?.slug || null,
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("Error GET /api/articles:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data artikel",
    });
  }
});

// GET /api/articles/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        thumbnail_url,
        content,
        author,
        published_at,
        category_id,
        categories (
          name,
          slug
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      // not found
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Artikel tidak ditemukan",
        });
      }
      throw error;
    }

    const mapped = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      thumbnail_url: data.thumbnail_url,
      content: data.content,
      author: data.author,
      published_at: data.published_at,
      category_id: data.category_id,
      category_name: data.categories?.name || null,
      category_slug: data.categories?.slug || null,
    };

    res.json({ success: true, data: mapped });
  } catch (err) {
    console.error("Error GET /api/articles/:id:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail artikel",
    });
  }
});

module.exports = router;
