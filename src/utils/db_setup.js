const mongoose = require("mongoose");
const constants = require("../utils/constants");

mongoose.connect(constants.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo Connection Error"));

module.exports = db;
