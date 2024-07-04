var express = require("express");
var path = require("path");
var app = express();

const PORT = process.env.PORT || 3000;

// Navigate up one level from the current directory and then into the "public" directory
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.get("/", function(_, res) {
    // Similarly, navigate up and then into the "public/index.html" file
    res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, function() {
    console.log(`Server is running on port ${PORT}`);
});