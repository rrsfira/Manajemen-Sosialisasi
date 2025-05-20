const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all apartments
router.get("/", (req, res) => {
    const query = `
        SELECT 
            a.id, 
            a.name, 
            a.address, 
            r.name AS region, 
            s.name AS subdistrict, 
            a.SK, 
            a.leader, 
            a.activity, 
            a.time, 
            a.gender_man, 
            a.gender_women, 
            a.age_19to44years, 
            a.age_over44years, 
            a.photo, 
            a.video
        FROM apartments a
        JOIN regions r ON a.region_id = r.id
        JOIN subdistricts s ON a.subdistrict_id = s.id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching apartments data:", err);
            res.status(500).send("Error fetching apartments data");
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
