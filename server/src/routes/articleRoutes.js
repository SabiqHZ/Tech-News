const express = require("express");
const router = express.Router();
const supabase = require("../config/db");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// helper buat slug sederhana
function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// GET /api/articles → list artikel + category_name (dengan pagination)
router.get("/", async (req, res) => {
  try {
    // pagination: ?page=1&limit=8
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data: articles,
      error: artErr,
      count,
    } = await supabase
      .from("articles")
      .select(
        "id, title, slug, thumbnail_url, content, author, published_at, category_id",
        { count: "exact" }
      )
      .order("published_at", { ascending: false })
      .range(from, to);

    if (artErr) throw artErr;

    const total = count || 0;
    const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

    if (!articles || articles.length === 0) {
      return res.json({
        success: true,
        data: [],
        page,
        limit,
        total,
        totalPages,
      });
    }

    const categoryIds = [
      ...new Set(articles.map((a) => a.category_id).filter(Boolean)),
    ];

    let categoriesMap = {};
    if (categoryIds.length > 0) {
      const { data: categories, error: catErr } = await supabase
        .from("categories")
        .select("id, name, slug")
        .in("id", categoryIds);

      if (catErr) throw catErr;

      categoriesMap = Object.fromEntries(
        (categories || []).map((c) => [c.id, c])
      );
    }

    const result = articles.map((a) => ({
      ...a,
      category_name: categoriesMap[a.category_id]?.name || null,
      category_slug: categoriesMap[a.category_id]?.slug || null,
    }));

    res.json({
      success: true,
      data: result,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (err) {
    console.error("GET /api/articles error", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data artikel" });
  }
});

// GET /api/articles/:id → detail artikel
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { data: article, error: artErr } = await supabase
      .from("articles")
      .select(
        "id, title, slug, thumbnail_url, content, author, published_at, category_id"
      )
      .eq("id", id)
      .maybeSingle();

    if (artErr) throw artErr;

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Artikel tidak ditemukan" });
    }

    let category = null;
    if (article.category_id) {
      const { data: cat, error: catErr } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("id", article.category_id)
        .maybeSingle();

      if (catErr) throw catErr;
      category = cat;
    }

    res.json({
      success: true,
      data: {
        ...article,
        category_name: category?.name || null,
        category_slug: category?.slug || null,
      },
    });
  } catch (err) {
    console.error("GET /api/articles/:id error", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil detail artikel" });
  }
});

// POST /api/articles (admin)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, category_id, thumbnail_url, content, author, status } =
    req.body;

  try {
    const slug = makeSlug(title);
    const published_at =
      status === "published" ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          title,
          slug,
          category_id,
          thumbnail_url,
          content,
          author,
          published_at,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error("POST /api/articles error", err);
    res.status(500).json({ success: false, message: "Gagal membuat artikel" });
  }
});

// PUT /api/articles/:id (admin)
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { title, category_id, thumbnail_url, content, author, status } =
    req.body;

  try {
    const slug = makeSlug(title);
    const published_at =
      status === "published" ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("articles")
      .update({
        title,
        slug,
        category_id,
        thumbnail_url,
        content,
        author,
        published_at,
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Artikel tidak ditemukan" });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("PUT /api/articles/:id error", err);
    res.status(500).json({ success: false, message: "Gagal update artikel" });
  }
});

// DELETE /api/articles/:id (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/articles/:id error", err);
    res.status(500).json({ success: false, message: "Gagal hapus artikel" });
  }
});

module.exports = router;
