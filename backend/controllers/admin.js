const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");

// 🔍 Fetch all users (admin)
router.get("/", (req, res) => {
    const query = `
        SELECT id, name, email, contact, role 
        FROM users
        WHERE role = 'admin'
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("Error fetching users");
        }
        res.json(results);
    });
});

// GET user by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT id, name, email, contact, role FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Gagal ambil data user" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json(results[0]);
  });
});

// ✏️ Update user by ID
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, contact, role, password } = req.body;

    if (password) {
        // Hash password dulu
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Error updating user");
            }

            const query = `
                UPDATE users 
                SET name = ?, email = ?, contact = ?, role = ?, password = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;
            const values = [name, email, contact, role, hashedPassword, id];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error("Error updating user:", err);
                    return res.status(500).send("Error updating user");
                }
                res.send("User updated successfully");
            });
        });
    } else {
        // Tanpa ganti password
        const query = `
            UPDATE users 
            SET name = ?, email = ?, contact = ?, role = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        const values = [name, email, contact, role, id];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error updating user:", err);
                return res.status(500).send("Error updating user");
            }
            res.send("User updated successfully");
        });
    }
});

// 🗑️ Delete user by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Gagal hapus data:", err);
      return res.status(500).json({ success: false, message: "Gagal hapus data" });
    }
    res.json({ success: true, message: "Berhasil dihapus" });
  });
});


module.exports = router;
