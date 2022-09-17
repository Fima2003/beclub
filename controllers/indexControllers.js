const responses = require("../responses");
const { convertResponse } = require('../external_functions');

exports.index = function(req, res){
    if(req.user) convertResponse(responses.success, res);
    else convertResponse(responses.not_found, res);
}

exports.adminPanel = function(req, res){
    res.render('admin_panel/verification');
}