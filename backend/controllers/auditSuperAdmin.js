// routes/audit.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  const sql = `
    SELECT 
      a.username,
      a.email,
      a.activity,
      DATE_FORMAT(a.time, '%Y-%m-%d %H:%i:%s') as time
    FROM audit_log a
    ORDER BY a.time DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
