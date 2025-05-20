const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all malls
router.get("/", (req, res) => {
    const query = `
        SELECT 
            m.id, 
            m.name, 
            m.address, 
            r.name AS region, 
            s.name AS subdistrict, 
            m.SK, 
            m.leader, 
            m.activity, 
            m.time, 
            m.gender_man, 
            m.gender_women, 
            m.age_19to44years, 
            m.age_over44years, 
            m.photo, 
            m.video
        FROM malls m
        JOIN regions r ON m.region_id = r.id
        JOIN subdistricts s ON m.subdistrict_id = s.id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching malls data:", err);
            res.status(500).send("Error fetching malls data");
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
