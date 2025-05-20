const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ✅ GET all regions
router.get("/", (req, res) => {
  const sql = "SELECT id, name FROM regions";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ✅ GET subdistricts by region_id
router.get("/subdistricts/:region_id", (req, res) => {
  const regionId = req.params.region_id;
  const sql = "SELECT id, name FROM subdistricts WHERE region_id = ?";

  db.query(sql, [regionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;
