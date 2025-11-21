const express = require("express");
const router = express.Router();
const pool = require("../config/db");
console.log("TYPE OF POOL:", typeof pool);

// GET /api/articles → list semua artikel
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `select 
         a.id,
         a.title,
         a.slug,
         a.thumbnail_url,
         a.content,
         a.author,
         a.published_at,
         a.category_id,
         c.name as category_name,
         c.slug as category_slug
       from articles a
       left join categories c on c.id = a.category_id
       order by a.published_at desc`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error get /api/articles", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data artikel",
    });
  }
});

// GET /api/articles/:id → detail artikel
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await pool.query(
      `select 
         a.id,
         a.title,
         a.slug,
         a.thumbnail_url,
         a.content,
         a.author,
         a.published_at,
         a.category_id,
         c.name as category_name,
         c.slug as category_slug
       from articles a
       left join categories c on c.id = a.category_id
       where a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error get /api/articles/:id", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail artikel",
    });
  }
});

module.exports = router;
