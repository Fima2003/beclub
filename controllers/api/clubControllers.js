const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const responses = require("../../responses");
const Club = require("../../models/clubModel");
const { convertResponse } = require('../../external_functions');

exports.sign_in = async function(req, res){
    const clubLoggingIn = req.body;
    console.log(clubLoggingIn);
    if(!clubLoggingIn.nickOrEmail || !clubLoggingIn.password){
        return convertResponse(responses.not_all_fields, res);
    }
    let dbClub = await Club.find({$or: [{nick: clubLoggingIn.nickOrEmail}, {support_email: clubLoggingIn.nickOrEmail}]});
    if(!dbClub){
        return convertResponse(responses.not_found, res);
    }
    bcrypt.compare(clubLoggingIn.password, dbClub.password).then(isCorrect => {
        if(isCorrect){
            const payload = {
                id: dbClub._id,
                nick: dbClub.nick,
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
                promotions: club.promotions,
                profile_image: club.profile_image,
                type: club.type
            });
        });
    }
}

exports.get_clubs = async function(req, res) {
    if(!req.query.nick){
        return convertResponse(responses.not_all_fields, res);
    }
    try {
        let clubs = await Club.find({nick: {$regex: req.query.nick}}).limit(10).select('_id nick profile_image type');
        return res.status(200).json({clubs: clubs});
    } catch (e) {
        return convertResponse(responses.custom_error(e), res);
    }
}

exports.update_club = function(req, res){
    if(req.body.nick!==undefined &&
        (req.body.subscriptions!==undefined || req.body.posts!==undefined ||
            req.body.comments!==undefined || req.body.promotions!==undefined
            || req.body.profileUrl!==undefined)){
        clubUpdate(req.body.nick, req.body.subscriptions, req.body.posts, req.body.comments, req.body.propositions, req.body.profileUrl)
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

async function clubUpdate(nick_to_update, subscribers, posts, comments, propositions, profileUrl){
    let update = {};
    if(subscribers) update['subscribers'] = subscribers;
    if(posts) update['posts'] = posts;
    if(comments) update['comments'] = comments;
    if(propositions) update['propositions'] = propositions;
    if(profileUrl)update['profile_url'] = profileUrl;
    return Club.updateOne({nick: nick_to_update}, update);
}

exports.delete_club = function(req, res){
    Club.deleteOne({nick: req.body.nick}).then((result) => {
        if(result.acknowledged){
            return convertResponse(responses.success, res);
        }else{
            return convertResponse(responses.custom_error(result), res);
        }
    })
}