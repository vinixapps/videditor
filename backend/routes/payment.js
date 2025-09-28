const express = require('express');
const router = express.Router();

// Simulasi database user/credit
let fakeSession = {}; // Atau import dari file db.js kalau sudah ada

// Create Payment (Top Up)
router.post('/create', (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid userId or amount" });
  }

  // Simulasi buat payment request (biasanya ke payment gateway, misal Xendit)
  const paymentId = "PMT" + Math.random().toString(36).slice(2, 10).toUpperCase();
  // Simpan di fakeSession pembayaran pending (production: simpan di database)
  if (!fakeSession[userId]) fakeSession[userId] = { credit: 0 };

  // Simulasi response payment gateway (misal: url QRIS, atau instruksi transfer)
  res.json({
    paymentId,
    status: "PENDING",
    amount,
    message: "Simulasi, redirect ke payment gateway di sini.",
    // Misal, url QRIS, Snap, dsb: paymentUrl: "https://gateway/qr/xxxx"
  });
});

// Webhook payment gateway (callback success)
router.post('/webhook', (req, res) => {
  const { userId, paymentId, status, amount } = req.body;
  // Validasi data (production: cek signature, dsb)
  if (status === "PAID" && userId && amount) {
    // Tambahkan credit user
    if (!fakeSession[userId]) fakeSession[userId] = { credit: 0 };
    fakeSession[userId].credit += parseInt(amount);
    return res.json({ success: true, credit: fakeSession[userId].credit });
  }
  res.status(400).json({ error: "Invalid payment status or data" });
});

// Get Credit Info (cek credit user)
router.get('/credit', (req, res) => {
  const userId = req.query.userId;
  if (!userId || !fakeSession[userId]) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ credit: fakeSession[userId].credit });
});

module.exports = router;

