// Mengimpor modul yang dibutuhkan
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// modul route (rute)
const dashboardRoute = require("./controllers/dashboard"); //dashboard
const authRoutes = require("./controllers/auth"); // login dan register
const usersRoutes = require("./controllers/profile"); // profile

const auditRoutes = require("./controllers/auditSuperAdmin"); //audit
const adminRoutes = require("./controllers/admin"); // data admin

const educationsRoute = require("./controllers/educations"); //materi
const gamesRoute = require("./controllers/games"); //kuis

const educationUnitsRoute = require("./controllers/educationUnits"); // satuan pendidikan
const healthFacilitiesRoute = require("./controllers/healthFacilities"); //fasilitas kesehatan
const publicHousingsRoute = require("./controllers/publicHousings"); //rusun
const mallsRoute = require("./controllers/malls"); //mall
const hotelsRoute = require("./controllers/hotels"); //hotel
const officesRoute = require("./controllers/offices"); //perkantoran
const apartementsRoute = require("./controllers/apartements"); //apartement
const urbanVillageRoute = require("./controllers/urbanVillage"); //kelurahan tangguh

const regionRoute = require("./controllers/region"); //dropdown wilayah
const chartRoute = require("./controllers/chart"); //chart drilldown

// Membuat instance aplikasi Express
const app = express();
// Menggunakan middleware CORS untuk mengizinkan permintaan dari domain yang berbeda
app.use(cors());

// Menggunakan middleware untuk memparsing request body dalam format JSON dan URL-encoded
app.use(express.json()); // Middleware untuk menangani data dari form (application/x-www-form-urlencoded)
// 'extended: true' memungkinkan parsing data nested (bertingkat)
app.use(express.urlencoded({ extended: true }));

// Mengimpor modul 'path' bawaan Node.js untuk mengelola path file/folder
const path = require("path");

// Middleware untuk menyajikan file statis dari folder 'uploads'
// Misalnya, file di /uploads/image.jpg bisa diakses di 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Menangani request GET ke root URL ("/")
app.use("/dashboard", dashboardRoute); //dashboard
app.use("/auth", authRoutes); //login dan register
app.use("/users", usersRoutes); //profile

app.use("/audit", auditRoutes); //audit
app.use("/admin", adminRoutes); //data admin

app.use("/educations", educationsRoute); //materi
app.use("/games", gamesRoute); //kuis

app.use("/education_units", educationUnitsRoute); //satuan pendidikan
app.use("/health_facilities", healthFacilitiesRoute); //fasilitas kesehatan
app.use("/public_housings", publicHousingsRoute); //rusun
app.use("/malls", mallsRoute); //mall
app.use("/hotels", hotelsRoute); //hotel
app.use("/offices", officesRoute); //perkantoran
app.use("/apartments", apartementsRoute); //apartement
app.use("/urban_village", urbanVillageRoute); //kelurahan tangguh

app.use("/region", regionRoute); //panggil dropdown wilayah
app.use("/chart", chartRoute); //chart drilldown



// Menentukan port server: ambil dari environment variable atau default ke 5000
const PORT = process.env.PORT || 5000;

// Menjalankan server dan menampilkan pesan saat berhasil dijalankan
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
