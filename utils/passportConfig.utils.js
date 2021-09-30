const passport = require("passport");
const usersModel = require("../models/users.model");
const LocalStrategy = require("passport-local").Strategy;
const { validatePass } = require("./password.utils");
passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      usersModel
        .findUser(username)
        .then((user) => {
          if (!validatePass(password, user.hash, user.salt)) {
            return done(null, false, {
              message: req.flash("error", "رمز عبور اشتباه است"),
            });
          }
          return done(null, user);
        })
        .catch(() => {
          return done(null, false, {
            message: req.flash("error", "نام کاربری یافت نشد"),
          });
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});
passport.deserializeUser((username, done) => {
  const user = usersModel.findUser(username);
  done(null, user);
});

function auth(req, res, next) {
  if (req.isAuthenticated()) {
    req.logedin = true;
  } else {
    req.logedin = false;
  }
  next();
}

module.exports = {
  passport,
  auth,
};
