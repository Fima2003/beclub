const responses = require("./responses");
require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { convertResponse } = require("./external_functions");

function isAdmin(req){
    const username = process.env.ADMIN_NICK;
    const pw = process.env.ADMIN_PW;
    return username === req.user.nick && bcrypt.compareSync(pw, req.user.password);
}

exports.adminsOnly = function(req, res, next){
    if(!req.user || !isAdmin(req)){
        return convertResponse(responses.not_authorized, res);
    }
    next();
}

exports.isAuthenticated = function(req, res, next){
    const token = req.headers['x-access-token']?.split(' ')[1];
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return convertResponse(responses.not_authorized);
            }
            req.user = {};
            req.user.id = decoded.id;
            req.user.password = decoded.password;
            req.user.nick = decoded.nick;
            req.user.email = decoded.email;
            return next();
        });
    }else {
        convertResponse(responses.custom_error("Incorrect token was given"), res);
    }
}

exports.userOnly = function(req, res, next){
    if(req.user.nick === req.body.nick || req.user.nick === req.params.nick || isAdmin(req)){
        return next();
    }
    return convertResponse(responses.forbidden, res);
}

exports.passwordRequired = function(req, res, next){
    if(bcrypt.compareSync(req.body.password, req.user.password) || isAdmin(req)){
        return next();
    }
    return convertResponse(responses.forbidden);
}