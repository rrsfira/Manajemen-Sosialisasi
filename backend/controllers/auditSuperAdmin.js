const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:table", (req, res) => {
    const { table } = req.params;
    const validTables = ["education_units"];

    if (!validTables.includes(table)) {
        return res.status(400).json({ error: "Tabel tidak valid" });
    }

    const query = `
        SELECT 
            u.name,
            CONCAT('Tambah ', eu.name) AS activity,
            eu.created_at AS time
        FROM ${table} eu
        JOIN users u ON eu.created_by = u.id
        WHERE eu.created_by IS NOT NULL

        UNION

        SELECT 
            u.name,
            CONCAT('Edit ', eu.name) AS activity,
            eu.updated_at AS time
        FROM ${table} eu
        JOIN users u ON eu.updated_by = u.id
        WHERE eu.updated_by IS NOT NULL

        UNION

        SELECT 
            u.name,
            CONCAT('Delete ', eu.name) AS activity,
            eu.deleted_at AS time
        FROM ${table} eu
        JOIN users u ON eu.deleted_by = u.id
        WHERE eu.deleted_by IS NOT NULL

        ORDER BY time DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Query error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        res.json(results);
    });
});
module.exports = router;
