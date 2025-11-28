const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email & password wajib diisi" });

  try {
    const result = await pool.query(
      "select id, name, email, password_hash, role from users where email = $1",
      [email]
    );
    if (result.rows.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });

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
    console.error("LOGIN ERROR", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
