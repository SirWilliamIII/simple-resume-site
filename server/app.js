/* jshint esversion: 6, node: true */
const express = require("express");
const path = require("path");
const fs = require("fs");
const { config } = require("dotenv");
config();
const {
  FingerprintJsServerApiClient,
} = require("@fingerprintjs/fingerprintjs-pro-server-api");

// Initialize an agent at application startup.
// Analyze the visitor when necessary.

const apiKey = process.env.API_KEY;
const visitorId = process.env.VISITOR_ID;
const envRegion = process.env.REGION;

const fpClient = new FingerprintJsServerApiClient({
  apiKey: apiKey,
  region: envRegion,
});

console.log(fpClient);

if (!visitorId) {
  console.error("Visitor ID not defined");
  process.exit(1);
}

if (!apiKey) {
  console.error("API key not defined");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(express.json());

function getFpClient() {
  fpPromise
    .then((fp) => fp.get())
    .then((result) => {
      // This is the visitor identifier:
      const visitorId = result.visitorId;
      console.log(visitorId);
    })
    .catch((error) => console.error(error));
}
app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.post("/visitorid", (req, res) => {
  const { newValue } = req.body;
  // Example: Update the .env file or set the environment variable
  // For updating .env file (not recommended for production)
  fs.appendFileSync(".env", `\nVISITOR_ID=${newValue}`);

  // Or, set the environment variable directly (preferred in production)
  process.env.VISITOR_ID = newValue;
  console.log(process.env.VISITOR_ID);

  res.send("Environment variable updated");
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
