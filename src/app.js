// src/app.js
"use strict";

const path = require("path");
const express = require("express");
const { router } = require("./chatapp.controller");
const methodOverride = require("method-override");
const PORT = 3000;

const run = () => {
  const app = express();
  app.get("/", (req, res) => {
    res.send("Hello, team5!");
  });

  app.use(express.static(path.resolve(__dirname, "public")));
  app.set("view engine", "ejs");
  app.set("views", path.resolve(__dirname, "views"));
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true }));

  app.use(router);

  app.listen(PORT, () => {
    console.log(`team5 app listening on port ${PORT}`);
  });
};

module.exports = {
  run,
};
