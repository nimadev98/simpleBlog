const router = require("express").Router();
const { passport } = require("../utils/passportConfig.utils");
const { addUser, findUser } = require("../models/users.model");
const path = require("path");
const formidalbe = require("formidable");
const fs = require("fs");

router.get("/login", (req, res) => {
  res.render("login", {
    logedin: req.logedin,
    error: req.flash("error"),
    user: req.user,
  });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/signup", (req, res) => {
  res.render("register", { logedin: req.logedin, error: req.flash("error") });
});
router.post("/signup", (req, res) => {
  const form = formidalbe({
    uploadDir: path.join("public", "img", "uploads"),
    keepExtensions: true,
  });
  form.parse(req, (err, fields, files) => {
    let imgpath = "";
    if (files.profile.size !== 0) {
      if (
        files.profile.type !== "image/jpeg" &&
        files.profile.type !== "image/jpg" &&
        files.profile.type !== "image/png"
      ) {
        fs.unlinkSync(files.profile.path);
        req.flash("error", "پسوند فایل مجاز نیست");
        return res.redirect("/signup");
      }
      const patharr = files.profile.path.split("\\");
      patharr[0] = "..";
      imgpath = patharr.join("/");
    } else {
      fs.unlinkSync(files.profile.path);
      imgpath = "../img/avatar.jpg";
    }

    findUser(fields.username)
      .then(() => {
        req.flash("error", "نام کاربری در دسترس نمی باشد");
        return res.redirect("/signup");
      })
      .catch(() => {
        fields.img = imgpath;
        addUser(fields);
        return res.status(201).redirect("/login");
      });
  });
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
