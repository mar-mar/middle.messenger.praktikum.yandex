// server.js
const express = require('express');

const app = express();
console.info(process.env.PORT);
const PORT = process.env.PORT || 3000;

app.use(express.static('dist'));
app.use('/node_modules/@fontsource', express.static('node_modules/@fontsource'));
app.use('/static', express.static('static'));

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
}); 
