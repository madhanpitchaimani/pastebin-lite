const express = require("express");
require("dotenv").config();

const healthRoutes = require("./routes/health.js");
const pasteRoutes = require("./routes/pastes.js");

const app = express();
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", pasteRoutes);
app.use("/", pasteRoutes);

// Health check (no prefix)
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

// Health check (API prefix)
app.get("/api/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
