const express = require("express");
const connectDB = require("../DB/connect");

const router = express.Router();

router.get("/healthz", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
