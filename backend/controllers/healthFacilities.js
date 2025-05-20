const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all education units
router.get('/', (req, res) => {
  const query = `
    SELECT hf.id, hf.name, hf.address, hf.category, r.name AS region, s.name AS subdistrict, hf.SK, hf.time
    FROM health_facilities hf
    JOIN regions r ON hf.region_id = r.id
    JOIN subdistricts s ON hf.subdistrict_id = s.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching health facilities data:', err);
      res.status(500).send('Error fetching health facilities data');
    } else {
      res.json(results);
    }
  });
});

// API endpoint to get the count of Puskesmas, Clinics, and Hospitals
router.get('/count', (req, res) => {
  const query = `
    SELECT
      SUM(CASE WHEN hf.category = 'Puskesmas' THEN 1 ELSE 0 END) AS puskesmas,
      SUM(CASE WHEN hf.category = 'Klinik' THEN 1 ELSE 0 END) AS klinik,
      SUM(CASE WHEN hf.category = 'Rumah Sakit' THEN 1 ELSE 0 END) AS rumah_sakit
    FROM health_facilities hf
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching health facilities count:', err);
      res.status(500).send('Error fetching health facilities count');
    } else {
      res.json(results[0]);
    }
  });
});


module.exports = router;
