// server.js
const express = require("express");
const pathUtils = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const indexPath = pathUtils.resolve("dist", "index.html");

app.use(express.static("dist"));

app.get("*", (req, res) {
    res.sendfile(indexPath);
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${PORT}!`);
});
