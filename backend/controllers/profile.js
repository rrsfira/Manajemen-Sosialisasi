const express = require("express");
const router = express.Router();
const db = require("../config/db");
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

module.exports = router;
