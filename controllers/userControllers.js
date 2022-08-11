const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const User = require('../models/userModel');
const responses = require('../responses');
const passport = require('passport');

exports.sign_in = function(req, res, next){}

exports.get_user = function(req, res, next){
    if(!req.isAuthenticated()){
        res.send(responses.not_authorized);
        return ;
    }else if(!req.query.nick){
        res.send(responses.not_all_fields);
        return ;
    }
    if(req.user.nick === req.query.nick){
        res.send(req.user);
    }else{
        User.findOne({nick: req.query.nick}, function(err, user){
            if(err) {
                res.send(responses.custom_error(err));
                return ;
            }
            if(!user) res.send(responses.not_found);
            if(user) res.send({
                nick: user.nick,
                first_name: user.first_name,
                last_name: user.last_name,
                last_entered: user.last_entered
            });

        });
    }
}

exports.create_user = function(req, res, next){
    let options = req.body;
    if(req.isAuthenticated()){
        res.send(responses.not_authorized);
        return ;
    }
    if(!requiredExists(options, req)){
        res.send(responses.not_all_fields);
        return ;
    }
    User.findOne({nick: options.nick}, function(err, user){
        if(err) {
            res.send(responses.custom_error(err));
            return ;
        }
        if(!user){
            userCreate(options.nick, options.email, options.password, options.first_name, options.last_name,
                options.date_of_birth, req.file.path, options.preferences.split(','),
                options.last_entered, options.amount_of_subscriptions, options.subscriptions,
                req, res);
        }else{
            res.send(responses.already_exists);
        }
    })
}

function requiredExists(options, req){
    return options.nick!==undefined && options.email!==undefined && options.password!==undefined && options.first_name!==undefined && options.last_name!==undefined
        && options.date_of_birth!==undefined && req.file!==undefined && options.preferences!==undefined;
}

function userCreate(nick, email, password, first_name, last_name,
                    date_of_birth, imagePath, preferences,
                    last_entered, amount_of_subscriptions,
                    subscriptions, req, res){
    // TODO: Add verification of e-mail
    // TODO: Add validation of data
    let id = crypto.createHash('sha256').update(nick).digest('hex');
    let pass = bcrypt.hashSync(password, 10);
    let userDetail = {
        _id: id,
        nick: nick,
        email: email,
        password: pass,
        first_name: first_name,
        last_name: last_name,
        date_of_birth: new Date(date_of_birth),
        image: {
            data: fs.readFileSync(imagePath),
            contentType: 'image/jpg'
        },
        preferences: preferences,
    };
    if(last_entered) userDetail.last_entered = last_entered;
    if(amount_of_subscriptions) userDetail.amount_of_subscriptions = amount_of_subscriptions;
    if(subscriptions) userDetail.subscriptions = subscriptions;
    console.log("Generated userDetail Object");
    let user = new User(userDetail);
    console.log("About to save");
    user.save(function (err) {
        fs.rmSync(req.file.path);
        fs.rmdirSync(req.file.destination);
        if (err) {
            res.send(responses.custom_error(err));
            return ;
        }
        console.log("User was created");
        res.send(responses.success);
    });
}

exports.update_user = function(req, res, next){
    if(!req.isAuthenticated()){
        res.send(responses.not_authorized);
        console.log("Not Authenticated")
        return ;
    }
    if(req.user.nick !== req.body.nick){
        res.send(responses.not_authorized);
        console.log(req.user.nick, req.body.nick);
        return ;
    }
    if(req.body.nick!==undefined && (req.body.first_name!==undefined || req.body.last_name!==undefined
        || req.file.path!==undefined || req.body.last_entered!==undefined)) {
        userUpdate(req.body.nick, req.body.first_name, req.body.last_name, req.file, req.body.last_entered)
            .then((result) => {
                if(result.modifiedCount > 0 && result.acknowledged){
                    res.send(responses.success);
                }else{
                    res.send(responses.custom_error(result));
                }
            });
    }else{
        res.send(responses.not_all_fields);
    }

}

async function userUpdate(nick_to_update, first_name, last_name, fileObj, last_entered){
    let update = {};
    if(first_name) update.first_name = first_name;
    if(last_name) update.last_name = last_name;
    if(fileObj) {
        update.image = {
            data: fs.readFileSync(fileObj.path),
            contentType: 'image/jpg'
        };
        fs.rmSync(fileObj.path);
        fs.rmdirSync(fileObj.destination);
    }
    if(last_entered) {
        update.last_entered = parseInt(last_entered);
    }
    return User.updateOne(
        {nick: nick_to_update}, update);
}

exports.sign_out = function(req, res, next){
    if(req.isAuthenticated()){
        req.logout(function(err){
            if(err) res.send(responses.success);
            else res.send(responses.success);
        });
    }else{
        res.send(responses.not_authorized);
    }
}

exports.delete_user = function(req, res, next){
    if(!req.isAuthenticated() || req.user.nick !== req.body.nick){
        res.send(responses.not_authorized);
        return ;
    }
    bcrypt.compare(req.body.password, req.user.password, function(err, isValid){
        if(err) {
            res.send(responses.custom_error(err));
            return ;
        }
        if(isValid){
            User.deleteOne({nick: req.body.nick}).then(function(result){
                if(result.acknowledged){
                    res.send(responses.success);
                }else{
                    res.send(responses.custom_error(result));
                }
            });
        }else{
            res.send(responses.wrong_password);
        }
    });
}
