require("dotenv").config();
const express = require("express");
const path = require("path");
const userController = require("./controllers/users.controller");
const loginController = require("./controllers/login.controller");
const postController = require("./controllers/posts.controller");
const { passport, auth } = require("./utils/passportConfig.utils");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://127.0.0.1:8000",
  })
);
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(auth);

//ROUTES

app.use(userController);
app.use(loginController);
app.use(postController);

module.exports = app;
