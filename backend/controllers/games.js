const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

// GET game by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM games WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(results[0]);
  });
});

// CREATE new game
router.post('/', (req, res) => {
  const { quizizz_url, updated_by } = req.body;
  const query = "INSERT INTO games (quizizz_url, updated_by) VALUES (?, ?)";

  db.query(query, [quizizz_url, updated_by], (err, result) => {
    if (err) {
      console.error("Error creating game:", err);
      res.status(500).send("Failed to create game");
    } else {
      res.json({ message: "Game created", id: result.insertId });
    }
  });
});

// UPDATE existing game
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { quizizz_url } = req.body;
  const updated_by = req.user.id;

  const query = "UPDATE games SET quizizz_url = ?, updated_by = ?, updated_at = NOW() WHERE id = ?";
  db.query(query, [quizizz_url, updated_by, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Game updated" });
  });
});

module.exports = router;
