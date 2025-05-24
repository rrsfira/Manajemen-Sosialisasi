const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/education_units"),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = sanitize(base).replace(/\s+/g, "-");
    cb(null, `${timestamp}-${safeBase}${ext}`);
  },
});

const upload = multer({ storage });

// Fetch all education units
router.get("/", (req, res) => {
  const sql = `
  SELECT 
    e.id,
    e.name,
    e.address,
    r.name AS region,
    s.name AS subdistrict,
    e.group,
    e.instance,
    e.leader,
    e.activity,
    e.gender_man,
    e.gender_women,
    e.age_under6years,
    e.age_6to10years,
    e.age_11to18years,
    e.age_over44years,
    e.photo,
    e.video,
    DATE_FORMAT(e.time, '%d-%m-%Y') as date,
    IF(e.SK IS NULL OR LENGTH(e.SK) = 0, '', e.SK) AS suratK
  FROM education_units e
  LEFT JOIN subdistricts s ON e.subdistrict_id = s.id
  LEFT JOIN regions r ON s.region_id = r.id
  WHERE e.deleted_at IS NULL
  ORDER BY e.id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ✅ CREATE Education Unit
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "photo", maxCount: 3 }, // izinkan sampai 5 foto
    { name: "sk", maxCount: 1 },
  ]),
  (req, res) => {
    const data = req.body;
    const files = req.files;
    const userId = req.user?.id;

    // ✅ Daftar kolom yang memang ada di tabel MySQL
    const allowedFields = [
      "name",
      "address",
      "region_id",
      "subdistrict_id",
      "group",
      "instance",
      "leader",
      "activity",
      "time",
      "gender_man",
      "gender_women",
      "age_under6years",
      "age_6to10years",
      "age_11to18years",
      "age_over44years",
      "video",
      "photo",
      "SK",
      "created_by",
      "created_at",
    ];

    // Ambil semua nama file foto (kalau ada), dan simpan sebagai array JSON
    const photoFilenames = files?.photo?.map((file) => file.filename) || [];

    const payload = {
      ...data,
      photo: JSON.stringify(photoFilenames), // simpan sebagai string JSON
      SK: files?.sk?.[0]?.filename || null,
      video: data.video || null,
      created_by: userId,
      created_at: new Date(),
    };
    // Bersihkan kolom tanggal kosong
    for (const key in payload) {
      if (
        key.toLowerCase().includes("date") ||
        key.toLowerCase().includes("tanggal")
      ) {
        if (!payload[key] || payload[key].trim() === "") {
          payload[key] = null;
        }
      }
    }

    // Hapus field yang tidak ada di tabel
    Object.keys(payload).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete payload[key];
      }
    });

    db.query("INSERT INTO education_units SET ?", payload, (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).send("Error creating data");
      }
      res
        .status(201)
        .json({ message: "Education unit created", id: result.insertId });
    });
  }
);

// ✅ GET Education Unit by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      e.id,
      e.name,
      e.address,
      r.name AS region,
      s.name AS subdistrict,
      e.group,
      e.instance,
      e.leader,
      e.activity,
      e.gender_man,
      e.gender_women,
      e.age_under6years,
      e.age_6to10years,
      e.age_11to18years,
      e.age_over44years,
      e.photo,
      e.video,
      e.time,
      IF(e.SK IS NULL OR LENGTH(e.SK) = 0, '', e.SK) AS SK
    FROM education_units e
    LEFT JOIN subdistricts s ON e.subdistrict_id = s.id
    LEFT JOIN regions r ON s.region_id = r.id
    WHERE e.id = ?
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

    // Format URL SK
    if (result.SK) {
      result.SK_url = `${baseUrl}/uploads/education_units/${encodeURIComponent(
        result.SK
      )}`;
    }

    // Format photo(s)
    try {
      const parsedPhoto = JSON.parse(result.photo);
      if (Array.isArray(parsedPhoto)) {
        result.photo = parsedPhoto.map(
          (filename) =>
            `${baseUrl}/uploads/education_units/${encodeURIComponent(filename)}`
        );
      } else {
        result.photo = [
          `${baseUrl}/uploads/education_units/${encodeURIComponent(
            result.photo
          )}`,
        ];
      }
    } catch (e) {
      if (result.photo) {
        result.photo = [
          `${baseUrl}/uploads/education_units/${encodeURIComponent(
            result.photo
          )}`,
        ];
      } else {
        result.photo = [];
      }
    }

    // Format tanggal jika ada
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

// ✅ UPDATE Education Unit
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "photo", maxCount: 3 },
    { name: "sk", maxCount: 1 },
  ]),
  (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    const userId = req.user?.id;

    const getOldQuery = "SELECT * FROM education_units WHERE id = ?";
    db.query(getOldQuery, [id], (err, oldResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (oldResults.length === 0)
        return res.status(404).json({ message: "Not found" });

      const oldData = oldResults[0];

      const removeFile = (filename) => {
        if (!filename) return;
        const filePath = path.join(
          __dirname,
          "../uploads/education_units",
          filename
        );
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      };

      let newPhoto = oldData.photo;
      if (req.files.photo) {
        const filenames = req.files.photo.map((file) => file.filename);
        // Hapus foto lama (jika ada)
        try {
          const oldPhotos = JSON.parse(oldData.photo || "[]");
          oldPhotos.forEach(removeFile);
        } catch (_) {}
        newPhoto = JSON.stringify(filenames);
      }
      let newVideo =
        fields.video !== undefined && fields.video !== ""
          ? fields.video
          : oldData.video;

      let newSk = oldData.SK;
      if (req.files.sk && req.files.sk[0]) {
        const sk = req.files.sk[0];
        removeFile(oldData.SK);
        newSk = sk.filename;
      }

      const updateSql = `
      UPDATE education_units SET 
        name = ?, address = ?, region_id = ?, subdistrict_id = ?, 
        \`group\` = ?, instance = ?, leader = ?, activity = ?, 
        time = ?, gender_man = ?, gender_women = ?, 
        age_under6years = ?, age_6to10years = ?, 
        age_11to18years = ?, age_over44years = ?, 
        photo = ?, video = ?, SK = ?, 
        updated_by = ?, updated_at = NOW()
      WHERE id = ?
    `;

      const values = [
        fields.name || oldData.name,
        fields.address || oldData.address,
        parseInt(fields.region_id) || oldData.region_id,
        parseInt(fields.subdistrict_id) || oldData.subdistrict_id,
        fields.group || oldData.group,
        fields.instance || oldData.instance,
        fields.leader || oldData.leader,
        fields.activity || oldData.activity,
        fields.time || oldData.time,
        parseInt(fields.gender_man) || oldData.gender_man,
        parseInt(fields.gender_women) || oldData.gender_women,
        parseInt(fields.age_under6years) || oldData.age_under6years,
        parseInt(fields.age_6to10years) || oldData.age_6to10years,
        parseInt(fields.age_11to18years) || oldData.age_11to18years,
        parseInt(fields.age_over44years) || oldData.age_over44years,
        newPhoto,
        newVideo,
        newSk,
        userId,
        id,
      ];

      db.query(updateSql, values, (err) => {
        if (err) {
          console.error("❌ UPDATE ERROR:", err); // sangat penting
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Data berhasil diupdate" });
      });
    });
  }
);

// ✅ DELETE Education Unit// DELETE /education_units/:id
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const selectSql = "SELECT photo, SK FROM education_units WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Data not found" });

    const { photo, SK } = result[0];

    // Hapus SK
    if (SK) {
      const skPath = path.join(__dirname, "../uploads/education_units", SK);
      if (fs.existsSync(skPath)) {
        fs.unlink(skPath, (err) => {
          if (err) console.error("Gagal hapus SK:", err);
        });
      }
    }

    // Hapus foto
    let photos = [];
    try {
      if (photo?.startsWith("[")) {
        photos = JSON.parse(photo);
      } else if (photo) {
        photos = [photo];
      }
    } catch (e) {
      photos = [photo];
    }

    photos.forEach((file) => {
      const filePath = path.join(__dirname, "../uploads/education_units", file);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Gagal hapus foto:", err);
        });
      }
    });

    // Update record
    const deleteSql = `
      UPDATE education_units
      SET deleted_by = ?, deleted_at = NOW()
      WHERE id = ?
    `;
    db.query(deleteSql, [userId, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Data dan file berhasil dihapus" });
    });
  });
});

module.exports = router;
