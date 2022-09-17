const responses = require("./responses");
require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.adminsOnly = function(req, res, next){
    const username = process.env.ADMIN_NICK;
    const pw = process.env.ADMIN_PW;
    if(!req.user || !(username === req.user.nick && bcrypt.compareSync(pw, req.user.password))){
        res.send(responses.not_authorized);
        return ;
    }
    next();
}

exports.isAuthenticated = function(req, res, next){
    const token = req.headers['x-access-token']?.split(' ')[1];
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.json({
                    isLoggedIn: false,
                    message: "Failed to authenticate"
                });
            }
            req.user = {};
            req.user.id = decoded.id;
            req.user.password = decoded.password;
            req.user.nick = decoded.nick;
            req.user.email = decoded.email;
            next();
        })
    }else{
        return res.json({message: "Incorrect token was given", isLoggedIn: false});
    }
}

exports.userOnly = function(req, res, next){
    const username = process.env.ADMIN_NICK;
    const pw = process.env.ADMIN_PW;
    if(req.user.nick === req.body.nick || req.user.nick === req.params.nick || (username === req.user.nick && bcrypt.compareSync(pw, req.user.password))){
        next();
    }else{
        res.send(responses.not_authorized);
    }
}