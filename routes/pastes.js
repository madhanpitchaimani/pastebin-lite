const express = require("express");
const { nanoid } = require("nanoid");

const Paste = require("../models/Paste.js");
const connectDB = require("../db/connect.js");

const router = express.Router();

/* ---------- TIME HANDLING ---------- */
function getNow(req) {
  if (process.env.TEST_MODE === "1") {
    const fakeTime = req.headers["x-test-now-ms"];
    if (fakeTime) return Number(fakeTime);
  }
  return Date.now();
}

/* ---------- CREATE PASTE ---------- */
router.post("/pastes", async (req, res) => {
  await connectDB();

  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views !== undefined && max_views < 1) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const id = nanoid(8);
  const now = getNow(req);

  const expiresAt = ttl_seconds
    ? new Date(now + ttl_seconds * 1000)
    : null;

  await Paste.create({
    _id: id,
    content,
    expiresAt,
    remainingViews: max_views ?? null
  });

  res.status(201).json({
    id,
    url: `${process.env.BASE_URL}/p/${id}`
  });
});

/* ---------- FETCH PASTE (API) ---------- */
router.get("/pastes/:id", async (req, res) => {
  await connectDB();
  const paste = await Paste.findById(req.params.id);

  if (!paste) return res.status(404).json({ error: "Not found" });

  const now = getNow(req);

  if (paste.expiresAt && now >= paste.expiresAt.getTime()) {
    return res.status(404).json({ error: "Expired" });
  }

  if (paste.remainingViews !== null) {
    if (paste.remainingViews <= 0) {
      return res.status(404).json({ error: "View limit exceeded" });
    }
    paste.remainingViews -= 1;
    await paste.save();
  }

  res.json({
    content: paste.content,
    remaining_views: paste.remainingViews,
    expires_at: paste.expiresAt
  });
});

/* ---------- VIEW PASTE (HTML) ---------- */
router.get("/p/:id", async (req, res) => {
  await connectDB();
  const paste = await Paste.findById(req.params.id);

  if (!paste) return res.status(404).send("Not Found");

  if (paste.expiresAt && Date.now() >= paste.expiresAt.getTime()) {
    return res.status(404).send("Not Found");
  }

  if (paste.remainingViews !== null) {
    if (paste.remainingViews <= 0) {
      return res.status(404).send("Not Found");
    }
    paste.remainingViews -= 1;
    await paste.save();
  }

  res.setHeader("Content-Type", "text/html");
  res.send(`<pre>${escapeHtml(paste.content)}</pre>`);
});

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

module.exports = router;
