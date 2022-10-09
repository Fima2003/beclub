const bcrypt = require("bcrypt");
const {convertResponse} = require("../../external_functions");
const responses = require("../../responses");

function isAdmin(req){
    const username = process.env.ADMIN_NICK;
    const pw = process.env.ADMIN_PW;
    return username === req.user.nick && bcrypt.compareSync(pw, req.user.password);
}

exports.isAdmin = isAdmin;

exports.adminsOnly = function(req, res, next){
    if(!req.user || !isAdmin(req)){
        return convertResponse(responses.not_authorized, res);
    }
    next();
}