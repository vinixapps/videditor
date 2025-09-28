const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup upload ke folder tmp/ (pastikan folder ada)
const upload = multer({ dest: path.join(__dirname, '../tmp') });

// Simulasi storage hasil
const RESULT_URL = '/sample-result.mp4'; // Nanti bisa generate URL file hasil dari server atau S3

// POST /videoProcess/remove
router.post('/remove', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video uploaded' });
    }
    // req.file.path => path file upload di server
    // Di sini biasanya kamu:
    // - Kirim file ke API Replicate, RunPod, dsb
    // - Tunggu hasil proses
    // - Return hasil (URL atau stream/download)

    // Dummy: hapus file upload (biar ga numpuk), balikin URL hasil dummy
    fs.unlinkSync(req.file.path);

    // Balikin URL hasil (nanti ganti ke hasil real dari Replicate/RunPod)
    res.json({
      success: true,
      message: "Subtitle/Watermark removed!",
      resultUrl: RESULT_URL,
      // Nanti bisa tambah: duration, credit_used, dsb
    });
  } catch (err) {
    res.status(500).json({ error: "Process failed", details: err.message });
  }
});

module.exports = router;

