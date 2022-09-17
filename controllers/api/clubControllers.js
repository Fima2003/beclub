const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const responses = require("../../responses");
const Club = require("../../models/clubModel");
const { convertResponse } = require('../../external_functions');

exports.sign_in = function(req, res){
    const clubLogginIn = req.body;
    console.log(clubLogginIn);
    if(!clubLogginIn.nickOrEmail || !clubLogginIn.password){
        return convertResponse(responses.not_all_fields, res);
    }
    let dbClub = Club.find({$or: [{nick: clubLogginIn.nickOrEmail}, {support_email: clubLogginIn.nickOrEmail}]});
    if(!dbClub){
        return convertResponse(responses.not_found, res);
    }
    bcrypt.compare(clubLogginIn.password, dbClub.password).then(isCorrect => {
        if(isCorrect){
            const payload = {
                id: dbClub._id,
                nick: dbClub.nick,
                email: dbClub.support_email,
                password: dbClub.password
            }
            jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token) => {
                if(err) {
                    return convertResponse(responses.custom_error(err), res);
                }
                return res.status(200).json({token: `Bearer ${token}`});
            });
        }else{
            return convertResponse(responses.wrong_password, res);
        }
    });
}

exports.sign_out = function(req, res){
    req.logout(function(err){
        if(err) return convertResponse(responses.custom_error(err), res);
        else return convertResponse(responses.success, res);
    });
}

exports.get_club = function(req, res){
    if(!req.query.nick){
        return convertResponse(responses.not_all_fields, res);
    }
    if(req.user.nick === req.query.nick){
        return convertResponse({"code": 200, "message": req.user}, res);
    }else{
        Club.findOne({nick: req.query.nick}, function(err, club){
            if(err) {
                return convertResponse(responses.custom_error(err), res);
            }
            if(!club) return convertResponse(responses.not_found, res);
            if(club) res.status(200).send({
                nick: club.nick,
                name: club.name,
                website: club.website,
                posts: club.posts,
                comments: club.comments,
                propositions: club.propositions
            });

        });
    }
}

exports.update_club = function(req, res){
    if(req.body.nick!==undefined &&
        (req.body.subscribers!==undefined || req.body.posts!==undefined ||
            req.body.comments!==undefined || req.body.propositions!==undefined
            || req.file.path!==undefined)){
        clubUpdate(req.body.nick, req.body.subscribers, req.body.posts, req.body.comments, req.body.propositions, req.file)
            .then((result) => {
                if(result.modifiedCount > 0 && result.acknowledged){
                    return convertResponse(responses.success, res);
                }else{
                    return convertResponse(responses.custom_error(result), res);
                }
            });
    }else{
        return convertResponse(responses.not_all_fields, res);
    }
}

async function clubUpdate(nick_to_update, subscribers, posts, comments, propositions, fileObj){
    let update = {};
    if(subscribers) update['subscribers'] = subscribers;
    if(posts) update['posts'] = posts;
    if(comments) update['comments'] = comments;
    if(propositions) update['propositions'] = propositions;
    if(fileObj){
        update['image'] = {
            data: fs.readFileSync(fileObj.path),
            contentType: 'image/jpg'
        }
    }
    return Club.updateOne({nick: nick_to_update}, update);
}

exports.delete_club = function(req, res){
    bcrypt.compare(req.body.password, req.user.password, function(err, isValid){
        if(err){
            return convertResponse(responses.custom_error(err), res);
        }
        if(isValid){
            Club.deleteOne({nick: req.body.nick}).then((result) => {
                if(result.acknowledged){
                    return convertResponse(responses.success, res);
                }else{
                    return convertResponse(responses.custom_error(result), res);
                }
            })
        }else{
            return convertResponse(responses.wrong_password, res);
        }
    });
}