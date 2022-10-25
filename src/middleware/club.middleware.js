const jwt = require("jsonwebtoken");
const { convertResponse } = require("../utils/external_functions");
const responses = require("../utils/responses");
const Club = require("../clubs/models/clubs.model");
const { isAdmin } = require("./admin.middleware");

function isAuthenticated(req, res, next) {
  const token = req.headers["x-access-token"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, decoded) => {
      if (err || (decoded.type !== "club" && decoded.type !== "admin")) {
        return convertResponse(responses.not_authorized);
      }
      Club.findOne({ nick: decoded.nick }).then((dbClub, err) => {
        if (err !== undefined) {
          return convertResponse(responses.custom_error(err), res);
        }
        if (!dbClub) {
          return convertResponse(responses.not_found, res);
        } else {
          req.club = {};
          req.club.id = decoded.id;
          req.club.nick = decoded.nick;
          req.club.email = decoded.email;
          req.club.name = decoded.name;
          req.club.type = decoded.type;
          return next();
        }
      });
    });
  } else {
    convertResponse(responses.custom_error("Incorrect token was given"), res);
  }
}

function authenticate(req, res, next) {
  const token = req.headers["x-access-token"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || decoded.type !== "club") {
        return next();
      }
      Club.findOne({ nick: decoded.nick }).then((dbClub, err) => {
        if (err || !dbClub) {
          return next();
        }
        req.club = {};
        req.club.id = decoded.id;
        req.club.password = decoded.password;
        req.club.nick = decoded.nick;
        req.club.email = decoded.email;
        req.club.name = decoded.name;
        return next();
      });
    });
  } else {
    return next();
  }
}

function clubOnly(req, res, next) {
  if (
    req.club.nick === req.body.nick ||
    req.club.nick === req.params.nick ||
    isAdmin(req)
  ) {
    return next();
  }
  return convertResponse(responses.forbidden, res);
}

module.exports = { clubOnly, authenticate, isAuthenticated };
