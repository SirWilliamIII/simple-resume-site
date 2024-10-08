const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const PORT = process.env.PORT || 3000;
const env = require("dotenv");

env.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

const { requiresAuth } = require("express-openid-connect");

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
