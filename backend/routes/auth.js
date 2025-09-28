const express = require('express');
const router = express.Router();

// Example: Middleware untuk simpan user session sederhana (pakai cookie/session/jwt untuk production)
let fakeSession = {}; // Hanya untuk demo, di production harus pakai Redis/DB/jwt/cookie

// LOGIN - simulasi login Google
router.post('/login', (req, res) => {
  const { email, name, avatar } = req.body;
  // Proses validasi user (jika pakai OAuth, cek token)
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Simpan sesi user
  const userId = email; // Bisa pakai UUID kalau mau
  fakeSession[userId] = { email, name, avatar, credit: 5 };

  // Simpan info userId di cookie (sederhana)
  res.cookie("userId", userId, { httpOnly: true, sameSite: "lax" });

  res.json({ success: true, user: fakeSession[userId] });
});

// LOGOUT
router.post('/logout', (req, res) => {
  const userId = req.cookies.userId;
  if (userId) delete fakeSession[userId];
  res.clearCookie("userId");
  res.json({ success: true });
});

// GET SESSION (cek status login)
router.get('/me', (req, res) => {
  const userId = req.cookies.userId;
  if (!userId || !fakeSession[userId]) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json({ user: fakeSession[userId] });
});

module.exports = router;

