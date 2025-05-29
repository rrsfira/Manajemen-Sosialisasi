const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:table", (req, res) => {
  const { table } = req.params;
  const validTables = [
    "education_units",
    "health_facilities",
    "public_housings",
    "malls",
    "hotels",
    "offices",
    "apartments",
    "urban_villages",
    "educations",
    "games",
  ];

  if (!validTables.includes(table)) {
    return res.status(400).json({ error: "Tabel tidak valid" });
  }

  let query = "";

  if (table === "games") {
    query = `
      SELECT 
        u.name,
        CONCAT('Edit ', g.name) AS activity,
        g.updated_at AS time
      FROM games g
      JOIN users u ON g.updated_by = u.id
      WHERE g.updated_by IS NOT NULL
      ORDER BY time DESC
    `;
  } else if (
    table === "education_units" ||
    table === "health_facilities" ||
    table === "public_housings" ||
    table === "malls" ||
    table === "hotels" ||
    table === "offices" ||
    table === "apartments" ||
    table === "urban_villages" ||
    table === "educations"
  ) {
    const aliasMap = {
      education_units: "eu",
      health_facilities: "hf",
      public_housings: "ph",
      malls: "m",
      hotels: "ht",
      offices: "of",
      apartments: "ap",
      urban_villages: "uv",
      educations: "ed",
    };

    const alias = aliasMap[table] || "t"; // default alias "t" kalau tidak ditemukan

    query = `
      SELECT 
        u.name,
        CONCAT('Tambah ', ${alias}.name) AS activity,
        ${alias}.created_at AS time
      FROM ${table} ${alias}
      JOIN users u ON ${alias}.created_by = u.id
      WHERE ${alias}.created_by IS NOT NULL

      UNION

      SELECT 
        u.name,
        CONCAT('Edit ', ${alias}.name) AS activity,
        ${alias}.updated_at AS time
      FROM ${table} ${alias}
      JOIN users u ON ${alias}.updated_by = u.id
      WHERE ${alias}.updated_by IS NOT NULL

      UNION

      SELECT 
        u.name,
        CONCAT('Delete ', ${alias}.name) AS activity,
        ${alias}.deleted_at AS time
      FROM ${table} ${alias}
      JOIN users u ON ${alias}.deleted_by = u.id
      WHERE ${alias}.deleted_by IS NOT NULL

      ORDER BY time DESC
    `;
  } else {
    // Default untuk tabel lain jika hanya ada updated_by
    query = `
      SELECT 
        u.name,
        CONCAT('Edit ', t.name) AS activity,
        t.updated_at AS time
      FROM ${table} t
      JOIN users u ON t.updated_by = u.id
      WHERE t.updated_by IS NOT NULL
      ORDER BY time DESC
    `;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
});

module.exports = router;
