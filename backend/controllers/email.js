const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config(); 
const upload = multer(); 

// Menginisialisasi Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Anda bisa menggunakan layanan email lain
  auth: {
    user: process.env.EMAIL_USER, // Email pengirim
    pass: process.env.EMAIL_PASS, // Password email pengirim
  },
});

router.post("/email/send-invoice", upload.single("pdf"), async (req, res) => {
  const { email } = req.body;
  const pdfBuffer = req.file?.buffer;

  if (!email || !pdfBuffer) {
    console.error("Email atau file PDF tidak diterima.");
    return res.status(400).json({ message: "Email dan file PDF wajib diisi." });
  }

  const mailOptions = {
    from: `"ShafiraHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Invoice Pembelian Anda",
    text: "Terima kasih telah berbelanja di ShafiraHub. Silakan lihat invoice terlampir.",
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer,
      },
    ],
  };

  try {
    console.log("Mengirim email ke:", email);
    await transporter.sendMail(mailOptions);
    console.log("Email berhasil dikirim.");
    res.status(200).json({ message: "Email berhasil dikirim ke " + email });
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    res.status(500).json({ message: "Gagal mengirim email.", error: error.message });
  }
});

module.exports = router;
