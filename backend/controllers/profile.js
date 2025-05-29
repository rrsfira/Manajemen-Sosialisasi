const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../middleware/authMiddleware");

// GET user profile
router.get('/', verifyToken, (req, res) => {
  const userId = req.user.id;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(results[0]);
  });
});

// PUT update user profile
router.put("/", verifyToken, (req, res) => {
  const userId = req.user.id;
  const { name, email, contact } = req.body;

  // Validasi input
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  // Update query untuk profile
  const query = `
    UPDATE users 
    SET name = ?, email = ?, contact = ? 
    WHERE id = ?
  `;

  db.query(query, [name, email, contact, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  });
});

// PUT update password khusus superadmin
router.put("/password", verifyToken, (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Old and new password are required" });
  }

  db.query("SELECT password, role FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];

    if (user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized: only superadmin can change password" });
    }

    // Cek password lama cocok
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash password baru
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Update password di DB
    db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId],
      (err, results) => {
        if (err) return res.status(500).json({ message: "DB error updating password" });
        return res.json({ message: "Password updated successfully" });
      }
    );
  });
});


module.exports = router;
