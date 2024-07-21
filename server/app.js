/* jshint esversion: 6, node: true */
const express = require("express");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");

const { config } = require("dotenv");
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const {
  FingerprintJsServerApiClient,
} = require("@fingerprintjs/fingerprintjs-pro-server-api");

const apiKey = process.env.API_KEY;
const envRegion = process.env.REGION;

const fpClient = new FingerprintJsServerApiClient({
  apiKey: apiKey,
  region: envRegion,
});

console.log(fpClient);

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.post("/visitorid", async (req, res) => {
  const { visitorId } = req.body; // Extract visitorId from the request body

  if (!visitorId) {
    return res.status(400).send("visitorId is required");
  }

  try {
    // Insert visitorId into the visitors table
    const result = await pool.query(
      "INSERT INTO visitors (id) VALUES ($1) RETURNING *",
      [visitorId]
    );

    console.log(`Inserted visitor: ${result.rows[0].visitor_id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
