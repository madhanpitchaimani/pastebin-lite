require("dotenv").config();
const express = require("express");

const healthRoutes = require("./Routes/health");
const pasteRoutes = require("./Routes/pastes");

const app = express();
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", pasteRoutes);
app.use("/", pasteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
