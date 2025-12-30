require("dotenv").config();
const express = require("express");

const healthRoutes = require("./routes/health");
const pasteRoutes = require("./routes/pastes");

const app = express();
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", pasteRoutes);
app.use("/", pasteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
