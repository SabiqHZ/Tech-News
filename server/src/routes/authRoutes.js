// server/src/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    // cek apakah email sudah ada
    const { data: existing, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (existingError) {
      console.error("Supabase error cek user:", existingError);
      return res.status(500).json({ message: "Error cek user" });
    }

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // insert user baru
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        role: "user",
      })
      .select("id, email, role")
      .single();

    if (error) {
      console.error("Supabase error register:", error);
      return res.status(500).json({ message: "Gagal membuat user baru" });
    }

    return res.status(201).json({
      user: data,
    });
  } catch (err) {
    console.error("Error /api/auth/register:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, password_hash, role")
      .eq("email", email)
      .limit(1);

    if (error) {
      console.error("Supabase error login:", error);
      return res.status(500).json({ message: "Error mengambil user" });
    }

    const user = data && data[0];

    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error /api/auth/login:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, (req, res) => {
  // kita ambil dari payload JWT
  return res.json({
    user: req.user,
  });
});

module.exports = router;
