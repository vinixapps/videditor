// backend/utils/antiabuse.js

// Penyimpanan limit sementara (di-memory, production sebaiknya Redis/db)
const limitStore = {};

/**
 * Middleware: Limit request per user (per fingerprint/userId) tiap endpoint
 * @param {Object} options - { windowMs: number, max: number }
 *    windowMs: interval waktu dalam ms, max: jumlah maksimum request
 */
function rateLimiter({ windowMs = 30000, max = 1 } = {}) {
  return function (req, res, next) {
    // Coba cari fingerprint atau userId
    const userKey =
      req.body.fingerprint ||
      req.query.fingerprint ||
      req.cookies.fingerprint ||
      req.body.userId ||
      req.query.userId ||
      req.cookies.userId ||
      req.ip;

    const endpoint = req.originalUrl;

    const now = Date.now();
    const key = `${userKey}:${endpoint}`;
    if (!limitStore[key]) {
      limitStore[key] = [];
    }
    // Hapus request di luar windowMs
    limitStore[key] = limitStore[key].filter(ts => now - ts < windowMs);

    if (limitStore[key].length >= max) {
      return res.status(429).json({
        error: "Too many requests, please wait before retrying.",
        wait_seconds: Math.ceil((windowMs - (now - limitStore[key][0])) / 1000)
      });
    }

    limitStore[key].push(now);
    next();
  };
}

module.exports = { rateLimiter };

