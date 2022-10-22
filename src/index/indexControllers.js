const responses = require("../../utils/responses");
const { convertResponse } = require("../../utils/external_functions");
const apiExtr = require("../../utils/decorators");

function index(req, res) {
  convertResponse(responses.success, res);
}

module.exports = { index };
