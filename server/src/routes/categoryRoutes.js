const express = require("express");
const router = express.Router();
const supabase = require("../config/db");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

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
    console.error("GET /api/categories error", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data kategori" });
  }
});

// GET /api/categories/:id/articles
router.get("/:id/articles", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { data: category, error: catErr } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("id", id)
      .maybeSingle();

    if (catErr) throw catErr;
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Kategori tidak ditemukan" });
    }

    const { data: articles, error: artErr } = await supabase
      .from("articles")
      .select(
        "id, title, slug, thumbnail_url, content, author, published_at, category_id"
      )
      .eq("category_id", id)
      .order("published_at", { ascending: false });

    if (artErr) throw artErr;

    res.json({
      success: true,
      category,
      data: articles || [],
    });
  } catch (err) {
    console.error("GET /api/categories/:id/articles error", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil artikel kategori",
    });
  }
});

// POST /api/categories (admin)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { name, slug } = req.body;

  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, slug }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error("POST /api/categories error", err);
    res.status(500).json({ success: false, message: "Gagal membuat kategori" });
  }
});

// PUT /api/categories/:id (admin)
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { name, slug } = req.body;

  try {
    const { data, error } = await supabase
      .from("categories")
      .update({ name, slug })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Kategori tidak ditemukan" });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("PUT /api/categories/:id error", err);
    res.status(500).json({ success: false, message: "Gagal update kategori" });
  }
});

// DELETE /api/categories/:id (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/categories/:id error", err);
    res.status(500).json({ success: false, message: "Gagal hapus kategori" });
  }
});

module.exports = router;
