const express = require("express");
const router = express.Router();
const db = require("../config/db"); // koneksi database

router.get('/health_facilities', (req, res) => {
  const regionQuery = `
    SELECT r.id AS region_id, r.name AS region_name, COUNT(ph.id) AS total
    FROM health_facilities ph
    JOIN regions r ON ph.region_id = r.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id
  `;

  const subdistrictQuery = `
    SELECT r.id AS region_id, s.name AS subdistrict_name, COUNT(ph.id) AS total
    FROM health_facilities ph
    JOIN regions r ON ph.region_id = r.id
    JOIN subdistricts s ON ph.subdistrict_id = s.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id, ph.subdistrict_id
  `;

  db.query(regionQuery, (err, regionResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error querying region data' });
    }

    db.query(subdistrictQuery, (err, subdistrictResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error querying subdistrict data' });
      }

      const series = regionResults.map(region => ({
        name: region.region_name,
        y: region.total,
        drilldown: region.region_name,
      }));

      const drilldownSeries = regionResults.map(region => ({
        id: region.region_name,
        name: `Kecamatan di ${region.region_name}`,
        data: subdistrictResults
          .filter(s => s.region_id === region.region_id)
          .map(s => [s.subdistrict_name, s.total]),
      }));

      res.json({ series, drilldownSeries });
    });
  });
});

router.get('/education_units', (req, res) => {
  const regionQuery = `
    SELECT r.id AS region_id, r.name AS region_name, COUNT(ph.id) AS total
    FROM education_units ph
    JOIN regions r ON ph.region_id = r.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id
  `;

  const subdistrictQuery = `
    SELECT r.id AS region_id, s.name AS subdistrict_name, COUNT(ph.id) AS total
    FROM education_units ph
    JOIN regions r ON ph.region_id = r.id
    JOIN subdistricts s ON ph.subdistrict_id = s.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id, ph.subdistrict_id
  `;

  db.query(regionQuery, (err, regionResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error querying region data' });
    }

    db.query(subdistrictQuery, (err, subdistrictResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error querying subdistrict data' });
      }

      const series = regionResults.map(region => ({
        name: region.region_name,
        y: region.total,
        drilldown: region.region_name,
      }));

      const drilldownSeries = regionResults.map(region => ({
        id: region.region_name,
        name: `Kecamatan di ${region.region_name}`,
        data: subdistrictResults
          .filter(s => s.region_id === region.region_id)
          .map(s => [s.subdistrict_name, s.total]),
      }));

      res.json({ series, drilldownSeries });
    });
  });
});


router.get('/apartments', (req, res) => {
  const regionQuery = `
    SELECT r.id AS region_id, r.name AS region_name, COUNT(ph.id) AS total
    FROM apartments ph
    JOIN regions r ON ph.region_id = r.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id
  `;

  const subdistrictQuery = `
    SELECT r.id AS region_id, s.name AS subdistrict_name, COUNT(ph.id) AS total
    FROM apartments ph
    JOIN regions r ON ph.region_id = r.id
    JOIN subdistricts s ON ph.subdistrict_id = s.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id, ph.subdistrict_id
  `;

  db.query(regionQuery, (err, regionResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error querying region data' });
    }

    db.query(subdistrictQuery, (err, subdistrictResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error querying subdistrict data' });
      }

      const series = regionResults.map(region => ({
        name: region.region_name,
        y: region.total,
        drilldown: region.region_name,
      }));

      const drilldownSeries = regionResults.map(region => ({
        id: region.region_name,
        name: `Kecamatan di ${region.region_name}`,
        data: subdistrictResults
          .filter(s => s.region_id === region.region_id)
          .map(s => [s.subdistrict_name, s.total]),
      }));

      res.json({ series, drilldownSeries });
    });
  });
});


router.get('/public_housing', (req, res) => {
  const regionQuery = `
    SELECT r.id AS region_id, r.name AS region_name, COUNT(ph.id) AS total
    FROM public_housings ph
    JOIN regions r ON ph.region_id = r.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id
  `;

  const subdistrictQuery = `
    SELECT r.id AS region_id, s.name AS subdistrict_name, COUNT(ph.id) AS total
    FROM public_housings ph
    JOIN regions r ON ph.region_id = r.id
    JOIN subdistricts s ON ph.subdistrict_id = s.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id, ph.subdistrict_id
  `;

  db.query(regionQuery, (err, regionResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error querying region data' });
    }

    db.query(subdistrictQuery, (err, subdistrictResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error querying subdistrict data' });
      }

      const series = regionResults.map(region => ({
        name: region.region_name,
        y: region.total,
        drilldown: region.region_name,
      }));

      const drilldownSeries = regionResults.map(region => ({
        id: region.region_name,
        name: `Kecamatan di ${region.region_name}`,
        data: subdistrictResults
          .filter(s => s.region_id === region.region_id)
          .map(s => [s.subdistrict_name, s.total]),
      }));

      res.json({ series, drilldownSeries });
    });
  });
});

router.get('/urban_villages', (req, res) => {
  const regionQuery = `
    SELECT r.id AS region_id, r.name AS region_name, COUNT(ph.id) AS total
    FROM urban_villages ph
    JOIN regions r ON ph.region_id = r.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id
  `;

  const subdistrictQuery = `
    SELECT r.id AS region_id, s.name AS subdistrict_name, COUNT(ph.id) AS total
    FROM urban_villages ph
    JOIN regions r ON ph.region_id = r.id
    JOIN subdistricts s ON ph.subdistrict_id = s.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id, ph.subdistrict_id
  `;

  db.query(regionQuery, (err, regionResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error querying region data' });
    }

    db.query(subdistrictQuery, (err, subdistrictResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error querying subdistrict data' });
      }

      const series = regionResults.map(region => ({
        name: region.region_name,
        y: region.total,
        drilldown: region.region_name,
      }));

      const drilldownSeries = regionResults.map(region => ({
        id: region.region_name,
        name: `Kecamatan di ${region.region_name}`,
        data: subdistrictResults
          .filter(s => s.region_id === region.region_id)
          .map(s => [s.subdistrict_name, s.total]),
      }));

      res.json({ series, drilldownSeries });
    });
  });
});

router.get('/offices', (req, res) => {
  const regionQuery = `
    SELECT r.id AS region_id, r.name AS region_name, COUNT(ph.id) AS total
    FROM offices ph
    JOIN regions r ON ph.region_id = r.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id
  `;

  const subdistrictQuery = `
    SELECT r.id AS region_id, s.name AS subdistrict_name, COUNT(ph.id) AS total
    FROM offices ph
    JOIN regions r ON ph.region_id = r.id
    JOIN subdistricts s ON ph.subdistrict_id = s.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id, ph.subdistrict_id
  `;

  db.query(regionQuery, (err, regionResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error querying region data' });
    }

    db.query(subdistrictQuery, (err, subdistrictResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error querying subdistrict data' });
      }

      const series = regionResults.map(region => ({
        name: region.region_name,
        y: region.total,
        drilldown: region.region_name,
      }));

      const drilldownSeries = regionResults.map(region => ({
        id: region.region_name,
        name: `Kecamatan di ${region.region_name}`,
        data: subdistrictResults
          .filter(s => s.region_id === region.region_id)
          .map(s => [s.subdistrict_name, s.total]),
      }));

      res.json({ series, drilldownSeries });
    });
  });
});

router.get('/malls', (req, res) => {
  const regionQuery = `
    SELECT r.id AS region_id, r.name AS region_name, COUNT(ph.id) AS total
    FROM malls ph
    JOIN regions r ON ph.region_id = r.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id
  `;

  const subdistrictQuery = `
    SELECT r.id AS region_id, s.name AS subdistrict_name, COUNT(ph.id) AS total
    FROM malls ph
    JOIN regions r ON ph.region_id = r.id
    JOIN subdistricts s ON ph.subdistrict_id = s.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id, ph.subdistrict_id
  `;

  db.query(regionQuery, (err, regionResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error querying region data' });
    }

    db.query(subdistrictQuery, (err, subdistrictResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error querying subdistrict data' });
      }

      const series = regionResults.map(region => ({
        name: region.region_name,
        y: region.total,
        drilldown: region.region_name,
      }));

      const drilldownSeries = regionResults.map(region => ({
        id: region.region_name,
        name: `Kecamatan di ${region.region_name}`,
        data: subdistrictResults
          .filter(s => s.region_id === region.region_id)
          .map(s => [s.subdistrict_name, s.total]),
      }));

      res.json({ series, drilldownSeries });
    });
  });
});

router.get('/hotels', (req, res) => {
  const regionQuery = `
    SELECT r.id AS region_id, r.name AS region_name, COUNT(ph.id) AS total
    FROM hotels ph
    JOIN regions r ON ph.region_id = r.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id
  `;

  const subdistrictQuery = `
    SELECT r.id AS region_id, s.name AS subdistrict_name, COUNT(ph.id) AS total
    FROM hotels ph
    JOIN regions r ON ph.region_id = r.id
    JOIN subdistricts s ON ph.subdistrict_id = s.id
    WHERE ph.deleted_at IS NULL
    GROUP BY ph.region_id, ph.subdistrict_id
  `;

  db.query(regionQuery, (err, regionResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error querying region data' });
    }

    db.query(subdistrictQuery, (err, subdistrictResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error querying subdistrict data' });
      }

      const series = regionResults.map(region => ({
        name: region.region_name,
        y: region.total,
        drilldown: region.region_name,
      }));

      const drilldownSeries = regionResults.map(region => ({
        id: region.region_name,
        name: `Kecamatan di ${region.region_name}`,
        data: subdistrictResults
          .filter(s => s.region_id === region.region_id)
          .map(s => [s.subdistrict_name, s.total]),
      }));

      res.json({ series, drilldownSeries });
    });
  });
});

module.exports = router;
