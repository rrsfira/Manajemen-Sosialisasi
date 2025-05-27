const express = require("express");
const router = express.Router();
const db = require("../config/db"); // koneksi database

// ========================
// ENDPOINT JUMLAH TOTAL
// ========================

router.get("/health-facilities", (req, res) => {
  const sql = `SELECT COUNT(*) AS total_health_facilities FROM health_facilities WHERE deleted_at IS NULL`;
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ total_health_facilities: rows[0].total_health_facilities });
  });
});

router.get("/education-units", (req, res) => {
  const sql = `SELECT COUNT(*) AS total_education_units FROM education_units WHERE deleted_at IS NULL`;
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ total_education_units: rows[0].total_education_units });
  });
});

router.get("/apartments", (req, res) => {
  const sql = `SELECT COUNT(*) AS total_apartments FROM apartments WHERE deleted_at IS NULL`;
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ total_apartments: rows[0].total_apartments });
  });
});

router.get("/malls", (req, res) => {
  const sql = `SELECT COUNT(*) AS total_malls FROM malls WHERE deleted_at IS NULL`;
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ total_malls: rows[0].total_malls });
  });
});

router.get("/hotels", (req, res) => {
  const sql = `SELECT COUNT(*) AS total_hotels FROM hotels WHERE deleted_at IS NULL`;
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ total_hotels: rows[0].total_hotels });
  });
});

router.get("/offices", (req, res) => {
  const sql = `SELECT COUNT(*) AS total_offices FROM offices WHERE deleted_at IS NULL`;
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ total_offices: rows[0].total_offices });
  });
});

router.get("/public-housings", (req, res) => {
  const sql = `SELECT COUNT(*) AS total_public_housings FROM public_housings WHERE deleted_at IS NULL`;
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ total_public_housings: rows[0].total_public_housings });
  });
});

router.get("/urban-villages", (req, res) => {
  const sql = `SELECT COUNT(*) AS total_urban_villages FROM urban_villages WHERE deleted_at IS NULL`;
  db.query(sql, (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ total_urban_villages: rows[0].total_urban_villages });
  });
});

// =============================
// ENDPOINT DINAMIS PER TAHUN
// =============================
// Endpoint dinamis: jumlah per tahun dari tabel apa pun
router.get("/group-by-year/:table", (req, res) => {
  const tableMap = {
    "health-facilities": "health_facilities",
    "education-units": "education_units",
    apartments: "apartments",
    malls: "malls",
    hotels: "hotels",
    offices: "offices",
    "public-housings": "public_housings",
    "urban-villages": "urban_villages",
  };

  const param = req.params.table;
  const tableName = tableMap[param];

  if (!tableName) {
    return res.status(400).json({ message: "Invalid table name" });
  }

  const sql = `
    SELECT YEAR(t.time) AS year, COUNT(*) AS value
    FROM ?? t
    WHERE t.deleted_at IS NULL
    GROUP BY YEAR(t.time)
    ORDER BY YEAR(t.time)
  `;

  db.query(sql, [tableName], (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Error", error: err.message });
    res.json({ data: rows });
  });
});

router.get("/fasilitas", (req, res) => {
  const query = `
    SELECT 
  r.name AS region,
  COALESCE(e.total, 0) AS education_units,
  COALESCE(h.total, 0) AS health_facilities,
  COALESCE(m.total, 0) AS malls,
  COALESCE(u.total, 0) AS public_housings,
  COALESCE(ho.total, 0) AS hotels,
  COALESCE(a.total, 0) AS apartments,
  COALESCE(o.total, 0) AS offices,
  COALESCE(uv.total, 0) AS urban_villages
FROM regions r
LEFT JOIN (
  SELECT region_id, COUNT(*) AS total FROM education_units WHERE deleted_at IS NULL GROUP BY region_id
) e ON r.id = e.region_id
LEFT JOIN (
  SELECT region_id, COUNT(*) AS total FROM health_facilities WHERE deleted_at IS NULL GROUP BY region_id
) h ON r.id = h.region_id
LEFT JOIN (
  SELECT region_id, COUNT(*) AS total FROM malls WHERE deleted_at IS NULL GROUP BY region_id
) m ON r.id = m.region_id
LEFT JOIN (
  SELECT region_id, COUNT(*) AS total FROM public_housings WHERE deleted_at IS NULL GROUP BY region_id
) u ON r.id = u.region_id
LEFT JOIN (
  SELECT region_id, COUNT(*) AS total FROM hotels WHERE deleted_at IS NULL GROUP BY region_id
) ho ON r.id = ho.region_id
LEFT JOIN (
  SELECT region_id, COUNT(*) AS total FROM apartments WHERE deleted_at IS NULL GROUP BY region_id
) a ON r.id = a.region_id
LEFT JOIN (
  SELECT region_id, COUNT(*) AS total FROM offices WHERE deleted_at IS NULL GROUP BY region_id
) o ON r.id = o.region_id
LEFT JOIN (
  SELECT region_id, COUNT(*) AS total FROM urban_villages WHERE deleted_at IS NULL GROUP BY region_id
) uv ON r.id = uv.region_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res
        .status(500)
        .json({ error: "Gagal mengambil data dari database" });
    }

    res.json(results);
  });
});

module.exports = router;
