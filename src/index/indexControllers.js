const responses = require("../utils/responses");
const { convertResponse } = require("../utils/external_functions");

function index(req, res) {
  convertResponse(responses.success, res);
}

module.exports = { index };
