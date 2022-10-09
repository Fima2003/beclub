const responses = require("../../responses");
const { convertResponse } = require('../../external_functions');

exports.index = function(req, res){
    convertResponse(responses.success, res);
}