const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all offices
router.get("/", (req, res) => {
    const query = `
        SELECT 
            o.id, 
            o.name, 
            o.address, 
            r.name AS region, 
            s.name AS subdistrict, 
            o.SK, 
            o.leader, 
            o.activity, 
            o.time, 
            o.gender_man, 
            o.gender_women, 
            o.age_19to44years, 
            o.age_over44years, 
            o.photo, 
            o.video
        FROM offices o
        JOIN regions r ON o.region_id = r.id
        JOIN subdistricts s ON o.subdistrict_id = s.id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching offices data:", err);
            res.status(500).send("Error fetching offices data");
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
