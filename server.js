// server.js
const express = require("express");
const pathUtils = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const indexPath = pathUtils.resolve("dist", "index.html");

// helmet
app.disable("x-powered-by");

app.use((req, res, next) => {
    res.header("X-Frame-Options", "SAMEORIGIN");
    res.header("Content-Security-Policy", "default-src 'self'; connect-src https://ya-praktikum.tech wss://ya-praktikum.tech; img-src *; object-src 'none'");
    res.header("X-XSS-Protection", "1; mode=block");
    // X-Content-Type-Options: nosniff

    next();
});

app.use(express.static("dist"));

app.all("*", (req, res) => {
    if (req.method === "HEADER") return;
    if (req.method === "GET") {
        res.sendfile(indexPath);
        return;
    }

    res.set("Allow", "GET");
    res.send(405, "Method Not Allowed");
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${PORT}!`);
});
