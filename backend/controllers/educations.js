const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

// GET game by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM educations WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Materi tidak ditemukan" });

    res.json(results[0]);
  });
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM educations WHERE deleted_at IS NULL", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// CREATE new Materi
router.post("/", verifyToken, (req, res) => {
  const { name, materi } = req.body;
  const created_by = req.user.id;

  const query = `
    INSERT INTO educations (name, materi, created_by, created_at) 
    VALUES (?, ?, ?, NOW())`;

  db.query(query, [name, materi, created_by], (err, result) => {
    if (err) {
      console.error("Error creating materi:", err);
      return res.status(500).send("Failed to create materi");
    }

    res.json({ message: "Materi created", id: result.insertId });
  });
});


// UPDATE existing Materi
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, materi } = req.body;
  const updated_by = req.user.id;

  const query = `
    UPDATE educations 
    SET name = ?, materi = ?, updated_by = ?, updated_at = NOW() 
    WHERE id = ?`;

  db.query(query, [name, materi, updated_by, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Materi updated" });
  });
});


// DELETE (soft delete) existing Materi
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const deleted_by = req.user.id;

  const query = `
    UPDATE educations 
    SET deleted_by = ?, deleted_at = NOW() 
    WHERE id = ?`;

  db.query(query, [deleted_by, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Materi not found or already deleted" });
    }

    res.json({ message: "Materi deleted successfully" });
  });
});


module.exports = router;
