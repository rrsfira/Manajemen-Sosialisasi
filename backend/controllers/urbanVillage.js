const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all urban villages
router.get("/", (req, res) => {
    const query = `
        SELECT 
            uv.id, 
            uv.name, 
            uv.address, 
            r.name AS region, 
            s.name AS subdistrict, 
            uv.SK, 
            uv.leader, 
            uv.activity, 
            uv.time, 
            uv.gender_man, 
            uv.gender_women, 
            uv.age_19to44years, 
            uv.age_over44years, 
            uv.photo, 
            uv.video
        FROM urban_villages uv
        JOIN regions r ON uv.region_id = r.id
        JOIN subdistricts s ON uv.subdistrict_id = s.id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching urban villages data:", err);
            res.status(500).send("Error fetching urban villages data");
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
