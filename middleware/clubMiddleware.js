const jwt = require("jsonwebtoken");
const {convertResponse} = require("../external_functions");
const responses = require("../responses");
const Club = require("../models/clubModel");
const { isAdmin } = require("./adminMiddleware");

exports.isAuthenticated = function(req, res, next) {
    const token = req.headers['x-access-token']?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return convertResponse(responses.not_authorized);
            }
            Club.findOne({nick: decoded.nick}).then((dbClub, err) => {
                if (err !== undefined) {
                    return convertResponse(responses.custom_error(err), res);
                }
                if (!dbClub) {
                    return convertResponse(responses.not_found, res);
                } else {
                    req.club = {};
                    req.club.id = decoded.id;
                    req.club.password = decoded.password;
                    req.club.nick = decoded.nick;
                    req.club.email = decoded.email;
                    req.club.name = decoded.name;
                    return next();
                }
            });
        });
    } else {
        convertResponse(responses.custom_error("Incorrect token was given"), res);
    }
}

exports.clubOnly = function(req, res, next){
    if(req.club.nick === req.body.nick || req.club.nick === req.params.nick || isAdmin(req)){
        return next();
    }
    return convertResponse(responses.forbidden, res);
}