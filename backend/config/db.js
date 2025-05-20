// Mengimpor library mysql2 untuk koneksi ke database MySQL
const mysql = require("mysql2");

// Memuat variabel lingkungan dari file .env (untuk keamanan informasi sensitif seperti password)
require("dotenv").config();

// Membuat koneksi ke database dengan menggunakan data dari file .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Mengecek koneksi ke database
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

module.exports = db;
