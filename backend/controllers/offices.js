const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sanitize = require("sanitize-filename");

// Konfigurasi penyimpanan sesuai field
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldName = file.fieldname;
    let folder = "uploads/offices";

    if (fieldName === "photo") folder += "/foto";
    else if (fieldName === "sk") folder += "/sk";

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = sanitize(base).replace(/\s+/g, "-");
    cb(null, `${timestamp}-${safeBase}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ GET semua offices
router.get("/", (req, res) => {
  const query = `
  SELECT 
    hf.id, hf.name, hf.address, hf.leader, hf.activity, 
    hf.gender_man,
    hf.gender_women,
    hf.age_19to44years,
    hf.age_over44years,
    r.name AS region, 
    s.name AS subdistrict, 
    IF(hf.SK IS NULL OR LENGTH(hf.SK) = 0, '', hf.SK) AS suratK,
    DATE_FORMAT(hf.time, '%d-%m-%Y') as date
  FROM offices hf
  LEFT JOIN regions r ON hf.region_id = r.id
  LEFT JOIN subdistricts s ON hf.subdistrict_id = s.id
  WHERE hf.deleted_at IS NULL
  ORDER BY hf.id ASC
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

// CREATE
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "photo", maxCount: 3 },
    { name: "sk", maxCount: 1 },
  ]),
  (req, res) => {
    const data = req.body;
    const files = req.files;
    const userId = req.user?.id;

    const photoFilenames = files?.photo?.map((f) => f.filename) || [];

    const payload = {
      ...data,
      photo: JSON.stringify(photoFilenames),
      SK: files?.sk?.[0]?.filename || null,
      created_by: userId,
      created_at: new Date(),
    };
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

    const allowedFields = [
      "name",
      "address",
      "region_id",
      "subdistrict_id",
      "leader",
      "activity",
      "time",
      "gender_man",
      "gender_women",
      "age_19to44years",
      "age_over44years",
      "video",
      "photo",
      "SK",
      "created_by",
      "created_at",
    ];

    // Hapus field yang tidak ada di tabel
    Object.keys(payload).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete payload[key];
      }
    });

    db.query("INSERT INTO offices SET ?", payload, (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).send("Error creating data");
      }
      res
        .status(201)
        .json({
          message: "offices ditambahkan",
          id: result.insertId,
        });
    });
  }
);

// ✅ GET offices by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      hf.id,
      hf.name,
      hf.address,
      r.name AS region,
      s.name AS subdistrict,
      hf.leader,
      hf.activity,
      hf.gender_man,
      hf.gender_women,
      hf.age_19to44years,
      hf.age_over44years,
      hf.photo,
      hf.video,
      hf.time,
      IF(hf.SK IS NULL OR LENGTH(hf.SK) = 0, '', hf.SK) AS SK
    FROM offices hf
    LEFT JOIN subdistricts s ON hf.subdistrict_id = s.id
    LEFT JOIN regions r ON s.region_id = r.id
    WHERE hf.id = ?
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
      result.SK_url = `${baseUrl}/uploads/offices/sk/${encodeURIComponent(
        result.SK
      )}`;
    }

    // Format photo(s)
    try {
      const parsedPhoto = JSON.parse(result.photo);
      if (Array.isArray(parsedPhoto)) {
        result.photo = parsedPhoto.map(
          (filename) =>
            `${baseUrl}/uploads/offices/foto/${encodeURIComponent(filename)}`
        );
      } else {
        result.photo = [
          `${baseUrl}/uploads/offices/foto/${encodeURIComponent(
            result.photo
          )}`,
        ];
      }
    } catch (e) {
      if (result.photo) {
        result.photo = [
          `${baseUrl}/uploads/offices/foto/${encodeURIComponent(
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

// ✅ UPDATE 
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

    // Fungsi hapus file SK
    const removeSkFile = (filename) => {
      if (!filename) return;
      const filePath = path.join(
        __dirname,
        "../uploads/offices/sk",
        filename
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    };

    // Fungsi hapus file Foto
    const removePhotoFile = (filename) => {
      if (!filename) return;
      const filePath = path.join(
        __dirname,
        "../uploads/offices/foto",
        filename
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    };

    // Ambil data lama
    const getOldQuery = "SELECT * FROM offices WHERE id = ?";
    db.query(getOldQuery, [id], (err, oldResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (oldResults.length === 0)
        return res.status(404).json({ message: "Not found" });

      const oldData = oldResults[0];

      // Update photo
      let newPhoto = oldData.photo;
      if (req.files.photo) {
        const filenames = req.files.photo.map((file) => file.filename);
        try {
          const oldPhotos = JSON.parse(oldData.photo || "[]");
          oldPhotos.forEach(removePhotoFile); // hapus semua foto lama
        } catch (_) {}
        newPhoto = JSON.stringify(filenames);
      }

      // Update video
      let newVideo =
        fields.video !== undefined && fields.video !== ""
          ? fields.video
          : oldData.video;

      // Update SK
      let newSk = oldData.SK;
      if (req.files.sk && req.files.sk[0]) {
        const sk = req.files.sk[0];
        removeSkFile(oldData.SK); // hapus SK lama
        newSk = sk.filename;
      }

      // Query update data
      const updateSql = `
        UPDATE offices SET 
          name = ?, address = ?, region_id = ?, subdistrict_id = ?, 
          leader = ?, activity = ?, 
          time = ?, gender_man = ?, gender_women = ?, 
          age_19to44years = ?, age_over44years = ?, 
          photo = ?, video = ?, SK = ?, 
          updated_by = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const values = [
        fields.name || oldData.name,
        fields.address || oldData.address,
        parseInt(fields.region_id) || oldData.region_id,
        parseInt(fields.subdistrict_id) || oldData.subdistrict_id,
        fields.leader || oldData.leader,
        fields.activity || oldData.activity,
        fields.time || oldData.time,
        parseInt(fields.gender_man) || oldData.gender_man,
        parseInt(fields.gender_women) || oldData.gender_women,
        parseInt(fields.age_19to44years) || oldData.age_19to44years,
        parseInt(fields.age_over44years) || oldData.age_over44years,
        newPhoto,
        newVideo,
        newSk,
        userId,
        id,
      ];

      db.query(updateSql, values, (err) => {
        if (err) {
          console.error("❌ UPDATE ERROR:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Data berhasil diupdate" });
      });
    });
  }
);
// ✅ DELETE Education Unit// DELETE /offices/:id
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const selectSql = "SELECT photo, SK FROM offices WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Data not found" });

    const { photo, SK } = result[0];

    // Hapus SK
    if (SK) {
      const skPath = path.join(__dirname, "../uploads/offices/sk", SK);
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
      const filePath = path.join(__dirname, "../uploads/offices/foto", file);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Gagal hapus foto:", err);
        });
      }
    });

    // Update record
    const deleteSql = `
      UPDATE offices
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
