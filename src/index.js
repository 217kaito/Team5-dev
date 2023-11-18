// src/index.js
"use strict";

const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello, team5!");
});

app.listen(PORT, () => {
  console.log(`team5 app listening on port ${PORT}`);
});
