const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder uploads/materi/ ada
const uploadDir = path.join(__dirname, "../uploads/materi");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowed = /pdf|ppt|pptx/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error("Hanya PDF, PPT, dan PPTX yang diperbolehkan"));
  },
});

// ✅ POST data materi
router.post("/", upload.single("materi"), (req, res) => {
  const { name } = req.body;
  const fileName = req.file ? req.file.filename : null;

  const sql = "INSERT INTO educations (name, materi) VALUES (?, ?)";
  db.query(sql, [name, fileName], (err, result) => {
    if (err) {
      console.error("Gagal menyimpan data:", err);
      return res.status(500).json({ error: "Gagal menyimpan data" });
    }
    res.status(201).json({ message: "Data berhasil disimpan" });
  });
});

// ✅ GET semua data materi
router.get("/", (req, res) => {
  const sql = "SELECT * FROM educations";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data:", err);
      return res.status(500).json({ error: "Gagal mengambil data" });
    }
    res.json(results);
  });
});

// ✅ GET data materi by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM educations WHERE id = ?";
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

// ✅ DELETE data materi by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Ambil nama file terlebih dahulu
  const getSql = "SELECT materi FROM educations WHERE id = ?";
  db.query(getSql, [id], (err, results) => {
    if (err) {
      console.error("Gagal mengambil data:", err);
      return res.status(500).json({ error: "Gagal mengambil data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    const fileName = results[0].materi;
    const filePath = path.join(uploadDir, fileName);

    // Hapus data dari database
    const deleteSql = "DELETE FROM educations WHERE id = ?";
    db.query(deleteSql, [id], (err) => {
      if (err) {
        console.error("Gagal menghapus data:", err);
        return res.status(500).json({ error: "Gagal menghapus data" });
      }

      // Hapus file jika ada
      if (fileName && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.warn("File gagal dihapus:", err);
          } else {
          }
        });
      }

      res.json({ message: "Data dan file berhasil dihapus" });
    });
  });
});

// ✅ PUT update materi
router.put("/:id", upload.single("materi"), (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Ambil materi lama untuk hapus file jika diganti
  const getSql = "SELECT materi FROM educations WHERE id = ?";
  db.query(getSql, [id], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Gagal mengambil data lama" });
    if (results.length === 0)
      return res.status(404).json({ error: "Data tidak ditemukan" });

    const oldFile = results[0].materi;
    const newFile = req.file ? req.file.filename : oldFile;

    const updateSql = "UPDATE educations SET name = ?, materi = ? WHERE id = ?";
    db.query(updateSql, [name, newFile, id], (err) => {
      if (err) return res.status(500).json({ error: "Gagal update data" });

      // Hapus file lama jika ada file baru
      if (req.file && oldFile && oldFile !== newFile) {
        const oldPath = path.join(uploadDir, oldFile);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      res.json({ message: "Data berhasil diperbarui" });
    });
  });
});

module.exports = router;
