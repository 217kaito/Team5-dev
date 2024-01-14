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
const bcrypt = require("bcrypt");
const passwordSaltRounds = 10;

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
    new LocalStrategy(function (userId, password, done) {
      (async () => {
        const user = await getUser(userId);
        if (!user) {
          return done(null, false);
        }
        if ((await bcrypt.compare(password, user.passwordHash)) === false) {
          return done(null, false);
        }
        done(null, user);
      })().catch(done);
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
      res.redirect("/login?stat=requirelogin");
    }
  };

  app.use(express.static(path.resolve(__dirname, "public")));
  app.set("view engine", "ejs");
  app.set("views", path.resolve(__dirname, "views"));
  app.use(methodOverride("_method"));
  app.use(express.urlencoded({ extended: true }));

  app.use("/threads", checkAuth, router);

  app.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/threads");
    }
    const stat = req.query.stat;
    if (stat === "dup") {
      return res
        .status(409)
        .render("register", { message: { error: "ユーザIDが重複しています" } });
    } else if (stat === "invalid") {
      return res
        .status(400)
        .render("register", { message: { error: "入力値が不正です" } });
    } else {
      return res.render("register", { message: {} });
    }
  });

  app.post("/register", (req, res, next) => {
    (async () => {
      const id = req.body.employeeid;
      const ip = req.ip;
      const username = req.body.username;
      const password = req.body.password;

      if (!id.match(/^[a-z]{2}[0-9]{6}$/)) {
        return res.status(400).send("invalid id");
      }
      if (!username.match(/^.{1,16}$/)) {
        return res.status(400).send("invalid username");
      }
      if (!password.match(/^.{8,16}$/)) {
        return res.status(400).send("invalid password");
      }
      if (await getUser(id)) {
        return res.redirect("/register?stat=dup");
      }

      const passwordHash = await bcrypt.hash(password, passwordSaltRounds);
      await createUser(id, ip, username, passwordHash);
      res.redirect("/login?stat=registered");
    })().catch(next);
  });

  app.get("/login", function (req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/threads");
    }
    const stat = req.query.stat;
    if (stat === "failed") {
      return res.render("login", {
        message: { error: "ログインに失敗しました" },
      });
    } else if (stat === "loggedout") {
      return res.render("login", { message: { info: "ログアウトしました" } });
    } else if (stat === "registered") {
      return res.render("login", { message: { info: "登録が完了しました" } });
    } else if (stat === "requirelogin") {
      return res.render("login", { message: { error: "ログインが必要です" } });
    } else {
      return res.render("login", { message: {} });
    }
  });

  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/threads",
      failureRedirect: "/login?stat=failed",
    }),
  );

  app.get("/logout", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/login?stat=loggedout");
    });
  });

  app.listen(PORT, () => {
    console.log(`team5 app listening on port ${PORT}`);
  });
};

module.exports = {
  run,
};
