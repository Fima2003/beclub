const responses = require("../responses");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { convertResponse } = require("../external_functions");
const User = require('../models/userModel');
const { isAdmin } = require("./adminMiddleware");

exports.isAuthenticated = function(req, res, next){
    const token = req.headers['x-access-token']?.split(' ')[1];
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return convertResponse(responses.not_authorized);
            }
            User.findOne({nick: decoded.nick}).then((dbUser, err) => {
                if(err !== undefined){
                    return convertResponse(responses.custom_error(err), res);
                }
                if(!dbUser){
                    return convertResponse(responses.not_found, res);
                }else{
                    req.user = {};
                    req.user.id = decoded.id;
                    req.user.password = decoded.password;
                    req.user.nick = decoded.nick;
                    req.user.email = decoded.email;
                    req.user.name = decoded.name;
                    return next();
                }
            });
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