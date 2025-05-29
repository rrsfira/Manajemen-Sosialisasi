const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

// Fungsi untuk format waktu SQL
const getNow = () => new Date().toISOString().slice(0, 19).replace("T", " ");

// ✅ POST data materi (dengan verifyToken)
router.post("/", verifyToken, (req, res) => {
  const { name, materi } = req.body;
  const userId = req.user.id;

  const sql = `
    INSERT INTO educations (name, materi, created_by, created_at)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [name, materi, userId, getNow()], (err) => {
    if (err) {
      console.error("Gagal menyimpan data:", err);
      return res.status(500).json({ error: "Gagal menyimpan data" });
    }
    res.status(201).json({ message: "Data berhasil disimpan" });
  });
});

// GET: Ambil semua data yang belum dihapus
router.get("/", (req, res) => {
  const sql = "SELECT * FROM educations WHERE deleted_at IS NULL";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data:", err);
      return res.status(500).json({ error: "Gagal mengambil data" });
    }
    res.json(results);
  });
});

// GET: Ambil data materi by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM educations WHERE id = ? AND deleted_at IS NULL";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Gagal mengambil data:", err);
      return res.status(500).json({ error: "Gagal mengambil data" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ success: true, data: results[0] });
  });
});

// ✅ PUT update (tanpa update jika data sudah dihapus)
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, materi } = req.body;
  const userId = req.user.id;

  const sql = `
    UPDATE educations
    SET name = ?, materi = ?, updated_by = ?, updated_at = ?
    WHERE id = ? AND deleted_at IS NULL
  `;
  db.query(sql, [name, materi, userId, getNow(), id], (err, result) => {
    if (err) return res.status(500).json({ error: "Gagal update data" });
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "Data tidak ditemukan atau sudah dihapus" });
    res.json({ message: "Data berhasil diperbarui" });
  });
});

// ✅ DELETE (soft delete)
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `
    UPDATE educations
    SET deleted_by = ?, deleted_at = ?
    WHERE id = ? AND deleted_at IS NULL
  `;
  db.query(sql, [userId, getNow(), id], (err, result) => {
    if (err) return res.status(500).json({ error: "Gagal menghapus data" });
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "Data tidak ditemukan atau sudah dihapus" });
    res.json({ message: "Data berhasil dihapus (soft delete)" });
  });
});

module.exports = router;
