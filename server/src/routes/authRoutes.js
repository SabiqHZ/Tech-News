const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email & password wajib diisi" });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password_hash, role")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("POST /api/auth/login error", err);
    res
      .status(500)
      .json({ success: false, message: "Internal server error (login)" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Nama, email, dan password wajib diisi",
    });
  }

  try {
    // cek apakah email sudah terdaftar
    const { data: existing, error: existingErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingErr) throw existingErr;

    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email sudah terdaftar" });
    }

    // hash password
    const password_hash = await bcrypt.hash(password, 10);

    // buat user baru dengan role 'user' (bukan admin)
    const { data: user, error: insertErr } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password_hash,
          role: "user",
        },
      ])
      .select("id, name, email, role")
      .single();

    if (insertErr) throw insertErr;

    // langsung buat token biar auto login setelah register
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.error("POST /auth/register error", err);
    res
      .status(500)
      .json({ success: false, message: "Internal server error (register)" });
  }
});

// LOGIN: POST /auth/login (punyamu yang lama)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email & password wajib diisi" });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password_hash, role")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("POST /api/auth/login error", err);
    res
      .status(500)
      .json({ success: false, message: "Internal server error (login)" });
  }
});

module.exports = router;
