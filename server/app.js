const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const PORT = process.env.PORT || 8000;
const env = require("dotenv");
env.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.get("/clientApiKey", (req, res) => {
  res.json({ apiKey: process.env.CLIENT_API_KEY });
});

app.post("/visitorid", async (req, res) => {
  try {
    const visitorId = req.body.visitorId;

    const queryText = "INSERT INTO visitors(id) VALUES($1)";
    const response = await pool.query(queryText, [visitorId]);

    res.status(200).send("Visitor ID stored successfully");
  } catch (error) {
    console.error("Error storing visitor ID:", error);
    res.status(500).send("Error storing visitor ID");
  }
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
