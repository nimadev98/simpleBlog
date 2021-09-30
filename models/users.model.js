const mongoose = require("mongoose");
const { genPass } = require("../utils/password.utils");

const userSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  fname: String,
  lname: String,
  img: String,
});
const User = new mongoose.model("User", userSchema);

function addUser(user) {
  const hashandsalt = genPass(user.password);
  const newUser = new User({
    username: user.username,
    hash: hashandsalt.hash,
    salt: hashandsalt.salt,
    fname: user.fname,
    lname: user.lname,
    img: user.img,
  });
  newUser.save();
  return newUser;
}

function findUser(username) {
  return new Promise((resolve, reject) => {
    User.findOne({ username: username }, (err, user) => {
      if (user) {
        resolve(user);
      } else {
        reject();
      }
    });
  });
}

module.exports = {
  addUser,
  findUser,
};
