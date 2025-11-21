const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/categories → list semua kategori
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "select id, name, slug from categories order by name asc"
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error get /api/categories", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kategori",
    });
  }
});

// GET /api/categories/:id/articles → artikel berdasarkan kategori
router.get("/:id/articles", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    // cek kategori
    const catResult = await pool.query(
      "select id, name, slug from categories where id = $1",
      [id]
    );

    if (catResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
    }

    const category = catResult.rows[0];

    // ambil artikel di kategori itu
    const articlesResult = await pool.query(
      `select 
         a.id,
         a.title,
         a.slug,
         a.thumbnail_url,
         a.content,
         a.author,
         a.published_at
       from articles a
       where a.category_id = $1
       order by a.published_at desc`,
      [id]
    );

    res.json({
      success: true,
      category,
      data: articlesResult.rows,
    });
  } catch (error) {
    console.error("Error get /api/categories/:id/articles", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil artikel kategori",
    });
  }
});

module.exports = router;
