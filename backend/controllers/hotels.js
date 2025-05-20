const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all hotels
router.get("/", (req, res) => {
    const query = `
        SELECT 
            h.id, 
            h.name, 
            h.address, 
            r.name AS region, 
            s.name AS subdistrict, 
            h.SK, 
            h.leader, 
            h.activity, 
            h.time, 
            h.gender_man, 
            h.gender_women, 
            h.age_19to44years, 
            h.age_over44years, 
            h.photo, 
            h.video
        FROM hotels h
        JOIN regions r ON h.region_id = r.id
        JOIN subdistricts s ON h.subdistrict_id = s.id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching hotels data:", err);
            res.status(500).send("Error fetching hotels data");
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
