var nodemailer = require("nodemailer");
const { EMAIL_NAME, EMAIL_PASSWORD } = require("./constants");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_NAME,
    pass: EMAIL_PASSWORD,
  },
});

module.exports = transporter;
