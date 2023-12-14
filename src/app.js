// src/app.js
"use strict";

const path = require("path");
const express = require("express");
const { router } = require("./chatapp.controller");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const PORT = 3000;
const { createUser, getUser } = require("./chatapp.service");

const run = () => {
  const app = express();
  app.get("/", (req, res) => {
    res.redirect("/threads");
  });

  app.use(
    session({
      secret: "keyboard cat", // FIXME
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // FIXME
        maxAge: 1000 * 60 * 60 * 6,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async function (userId, password, done) {
      const user = await getUser(userId);
      if (!user) {
        return done(null, false);
      }
      if (!(user.password === password)) {
        return done(null, false);
      }
      return done(null, user);
    }),
  );

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, {
        id: user.id,
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  };

  app.use(express.static(path.resolve(__dirname, "public")));
  app.set("view engine", "ejs");
  app.set("views", path.resolve(__dirname, "views"));
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true }));

  app.use("/threads", checkAuth, router);

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.post("/register", async (req, res) => {
    const id = req.body.employeeid;
    const ip = req.ip;
    const username = req.body.username;
    const password = req.body.password;

    if (id === "" || username === "" || password === "") {
      res.status(400).send("invalid parameter");
      return;
    }
    if (await getUser(id)) {
      res.status(409).send("userId already exists");
      return;
    }
    // TODO: usernameの制約を追加する
    // TODO: passwordの制約を追加する

    createUser(id, ip, username, password).then(() => {
      res.redirect("/login");
    }).catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
  });

  app.get("/login", async function (req, res) {
    res.render("login");
  });

  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/threads",
      failureRedirect: "/login",
    }),
  );

  app.get("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/threads");
    });
  });

  app.listen(PORT, () => {
    console.log(`team5 app listening on port ${PORT}`);
  });
};

module.exports = {
  run,
};
