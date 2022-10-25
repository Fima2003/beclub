require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const EMAIL_NAME = process.env.EMAIL_NAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

module.exports = {
  DATABASE_URL,
  JWT_SECRET,
  SESSION_SECRET,
  EMAIL_NAME,
  EMAIL_PASSWORD,
};
