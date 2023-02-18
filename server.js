// server.js
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("dist"));
app.use("/node_modules/@fontsource", express.static("node_modules/@fontsource"));
app.use("/static", express.static("static"));

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${PORT}!`);
});
