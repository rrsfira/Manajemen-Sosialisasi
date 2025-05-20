const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all public housings
router.get("/", (req, res) => {
    const query = `
   SELECT 
  ph.id, 
  ph.name, 
  ph.address, 
  r.name AS region, 
  s.name AS subdistrict, 
  ph.SK, 
  ph.time
FROM public_housings ph
JOIN regions r ON ph.region_id = r.id
JOIN subdistricts s ON ph.subdistrict_id = s.id;
  `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching public housings data:", err);
            res.status(500).send("Error fetching public housings data");
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
