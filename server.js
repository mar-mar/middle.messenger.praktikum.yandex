// server.js
const express = require("express");
const fallback = require("express-history-api-fallback");

const app = express();
const PORT = process.env.PORT || 3000;

const root = `${__dirname}/dist`;

app.disable("x-powered-by");

app.use((req, res, next) => {
    res.header("X-Frame-Options", "SAMEORIGIN");
    // res.header("Content-Security-Policy", "default-src 'self'; connect-src https://ya-praktikum.tech wss://ya-praktikum.tech; img-src *; object-src 'none'");
    res.header("X-XSS-Protection", "1; mode=block");
    // X-Content-Type-Options: nosniff

    next();
});

app.use(express.static("dist"));
app.use(fallback("index.html", { root }));

app.all("*", (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD") {
        next();
        return;
    }
    res.set("Allow", "GET,HEAD");
    res.status(405).send("Method Not Allowed");
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${PORT}!`);
});
