const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const PORT = process.env.PORT || 3000;
const env = require("dotenv");

env.config();


app.use(auth(config));


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

app.get('/login', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
})

const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
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