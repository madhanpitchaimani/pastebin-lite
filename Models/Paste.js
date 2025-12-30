const mongoose = require("mongoose");

const PasteSchema = new mongoose.Schema({
  _id: String,
  content: { type: String, required: true },
  expiresAt: { type: Date, default: null },
  remainingViews: { type: Number, default: null }
});

module.exports = mongoose.model("Paste", PasteSchema);
