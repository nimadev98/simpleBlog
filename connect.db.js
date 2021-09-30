require("dotenv").config();
const mongoose = require("mongoose");

async function databaseConnect() {
  await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = databaseConnect;
