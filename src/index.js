// src/index.js
"use strict";

const path = require("path");

const express = require("express");
const methodOverride = require("method-override");
const app = express();
const PORT = 3000;

const { router } = require("./chatapp.controller");

app.get("/", (req, res) => {
  res.send("Hello, team5!");
});

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use(router);

app.use(methodOverride("_method"));

app.listen(PORT, () => {
  console.log(`team5 app listening on port ${PORT}`);
});
