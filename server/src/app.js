const express = require("express");
const cors = require("cors");

const articleRoutes = require("./routes/articleRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Tech News API running" });
});

app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/categories", categoryRoutes);

module.exports = app;
