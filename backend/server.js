const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*", // Ganti ke frontend URL jika perlu, misal: "https://your-frontend.vercel.app"
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (misal sample-result.mp4, logo, dsb)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/tmp', express.static(path.join(__dirname, 'tmp'))); // sementara, hanya untuk develop

// Routers
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const videoProcessRoutes = require('./routes/videoProcess');

app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/videoProcess', videoProcessRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Video Remover Backend API is running!");
});

// Catch all not found
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]", err);
  res.status(500).json({ error: "Internal server error." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});

