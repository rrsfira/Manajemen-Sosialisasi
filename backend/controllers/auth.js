// Import library yang dibutuhkan
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // keamanan bash
const jwt = require("jsonwebtoken"); // token
const db = require("../config/db"); // config database
require("dotenv").config(); // Load variabel lingkungan dari .env
const tokenBlacklist = require("../middleware/tokenBlacklist");

// ============================
// REGISTER
// ============================
router.post("/register", async (req, res) => {
  // Ambil data dari body request
  const {
    name,
    email,
    password,
    role,
    contact,
  } = req.body;

  // Validasi input dasar
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Name, email, password, and role are required" });
  }

  // Validasi role hanya bisa "user" atau "admin"
  const validRoles = ["admin", "superadmin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Cek apakah email sudah terdaftar
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Query untuk insert user baru
    const sql = `
      INSERT INTO users (
        role, name, email, password, contact, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      role,
      name,
      email,
      hashedPassword,
      contact,
    ];

    // Simpan ke database
    const [result] = await db.promise().query(sql, values);

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    // Kirim response sukses
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// LOGIN
// ============================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Cek user berdasarkan email
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    // Jika user tidak ditemukan
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    // Bandingkan password input dengan password hash di database
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    // Kirim data user beserta token
    res.json({
      token,
      role: user.role,
      name: user.name,
      user_id: user.id,
    });
  });
});

// ============================
// LOGOUT
// ============================
router.post("/logout", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  tokenBlacklist.push(token); // Tambahkan token ke blacklist
  res.json({ message: "Logged out successfully" });
});


module.exports = router;
