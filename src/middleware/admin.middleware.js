const { convertResponse } = require("../../utils/external_functions");
const responses = require("../../utils/responses");

function isAdmin(req) {
  return req.user.type === "admin";
}

function adminsOnly(req, res, next) {
  if (!req.user || !isAdmin(req)) {
    return convertResponse(responses.not_authorized, res);
  }
  return next();
}

module.exports = { adminsOnly, isAdmin };
