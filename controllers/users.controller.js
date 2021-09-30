const express = require("express");
const usersModel = require("../models/users.model");
const router = express.Router();

router.get("/getUserId", async (req, res) => {
  const user = await req.user;
  res.json(user.username);
});

module.exports = router;
