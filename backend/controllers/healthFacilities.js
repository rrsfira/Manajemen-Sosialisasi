const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../middleware/authMiddleware");

// Pastikan folder target ada
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Konfigurasi storage berdasarkan fieldname
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/health_facilities/others";

    if (file.fieldname === "photo") {
      folder = "uploads/health_facilities/foto";
    } else if (file.fieldname === "sk") {
      folder = "uploads/health_facilities/sk";
    }

    ensureDirExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const upload = multer({ storage });

// ✅ POST data baru
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "photo", maxCount: 3 },
    { name: "sk", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        address,
        region_id,
        subdistrict_id,
        category,
        type,
        leader,
        activity,
        time,
        gender_man,
        gender_women,
        age_under6years,
        age_6to10years,
        age_11to18years,
        age_over44years,
        video,
      } = req.body;

      const userId = req.user.id;

      const photoPaths = (req.files["photo"] || [])
        .map((file) => `health_facilities/foto/${file.filename}`)
        .join(",");

      const skPath = req.files["sk"]?.[0]
        ? `health_facilities/sk/${req.files["sk"][0].filename}`
        : null;

      const age_19to44years = parseInt(age_6to10years || 0) + parseInt(age_11to18years || 0);

      const sql = `
        INSERT INTO health_facilities (
          name, address, region_id, subdistrict_id,
          type, category, SK, leader, activity, time,
          gender_man, gender_women, age_19to44years, age_over44years,
          photo, video, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.promise().query(sql, [
        name,
        address,
        region_id,
        subdistrict_id,
        type, 
        category, 
        skPath,
        leader,
        activity,
        time,
        gender_man,
        gender_women,
        age_19to44years,
        age_over44years,
        photoPaths,
        video,
        userId,
      ]);

      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error("❌ Error saving health facility:", err);
      res.status(500).json({ error: "Gagal menyimpan data" });
    }
  }
);

// ✅ GET semua fasilitas
router.get("/", (req, res) => {
  const query = `
    SELECT hf.id, hf.name, hf.address, hf.category, 
           r.name AS region, 
           s.name AS subdistrict, 
           hf.SK, hf.time
    FROM health_facilities hf
    LEFT JOIN regions r ON hf.region_id = r.id
    LEFT JOIN subdistricts s ON hf.subdistrict_id = s.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching health facilities data:", err);
      res.status(500).send("Error fetching health facilities data");
    } else {
      res.json(results);
    }
  });
});

// ✅ GET count berdasarkan kategori
router.get("/count", (req, res) => {
  const query = `
    SELECT
      SUM(CASE WHEN hf.category = 'Puskesmas' THEN 1 ELSE 0 END) AS puskesmas,
      SUM(CASE WHEN hf.category = 'Klinik' THEN 1 ELSE 0 END) AS klinik,
      SUM(CASE WHEN hf.category = 'Rumah Sakit' THEN 1 ELSE 0 END) AS rumah_sakit
    FROM health_facilities hf
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching health facilities count:", err);
      res.status(500).send("Error fetching health facilities count");
    } else {
      res.json(results[0]);
    }
  });
});

// ✅ GET satu fasilitas berdasarkan ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      h.id,
      h.name,
      h.address,
      r.name AS region,
      s.name AS subdistrict,
      h.category,
      h.type,
      h.leader,
      h.activity,
      h.gender_man,
      h.gender_women,
      h.age_19to44years,
      h.age_over44years,
      h.photo,
      h.video,
      h.time,
      IF(h.SK IS NULL OR LENGTH(h.SK) = 0, '', h.SK) AS SK
    FROM health_facilities h
    LEFT JOIN subdistricts s ON h.subdistrict_id = s.id
    LEFT JOIN regions r ON s.region_id = r.id
    WHERE h.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    const baseUrl = req.protocol + "://" + req.get("host");
    const result = results[0];

    // Format SK URL jika ada
    if (result.SK) {
      result.SK_url = `${baseUrl}/uploads/${encodeURIComponent(result.SK)}`;
    } else {
      result.SK_url = "";
    }

    // Format photo URL array
    if (result.photo) {
      const photoArray = result.photo.split(",");
      result.photo = photoArray.map((filename) =>
        `${baseUrl}/uploads/${encodeURIComponent(filename)}`
      );
    } else {
      result.photo = [];
    }

    // Format tanggal
    result.date = result.time
      ? new Date(result.time).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    res.json(result);
  });
});


module.exports = router;
