const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../../models/userModel');
const responses = require('../../responses');
const { convertResponse } = require('../../external_functions');

exports.sign_in = function(req, res){
    const userLogginIn = req.body;
    if(!userLogginIn.nick || !userLogginIn.password){
        return convertResponse(responses.not_all_fields, res);
    }
    User.findOne({$or: [{nick: userLogginIn.nick}, {email: userLogginIn.nick}]}).then((dbUser, err) => {
        if(err !== undefined){
            console.log("Error here");
            return convertResponse(responses.custom_error(err), res);
        }
        if(!dbUser){
            return convertResponse(responses.not_found, res);
        }
        bcrypt.compare(userLogginIn.password, dbUser.password).then(isCorrect => {
            if(isCorrect){
                const payload = {
                    id: dbUser._id,
                    nick: dbUser.nick,
                    email: dbUser.email,
                    password: dbUser.password
                }
                jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token)=> {
                    if(err) {
                        return convertResponse(responses.custom_error(err), res);
                    }
                    return res.status(200).json({token: `Bearer ${token}`});
                });
            }else{
                return convertResponse(responses.wrong_password, res);
            }
        })
    });
}

exports.get_user = function(req, res){
    return convertResponse(req.user, res);
}

exports.create_user = async function(req, res){
    let options = req.body;
    if(!requiredExists(options)){
        return convertResponse(responses.not_all_fields, res);
    }
    let takenNick = await User.findOne({nick: options.nick});
    let takenMail = await User.findOne({email: options.email});
    if(takenNick){
        return convertResponse(responses.user_already_exists, res);
    }else if(takenMail){
        return convertResponse(responses.email_already_exists, res);
    }
    userCreate(options.nick, options.email, options.password, options.first_name, options.last_name,
        options.date_of_birth, options.preferences.split(','),
        options.gender, res);
}

function requiredExists(options){
    try {
        const mailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const usernameRegExp = /^[a-z0-9._]{3,12}$/;
        const passRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.])[A-Za-z\d@$!%*?&_.]{8,}$/;
        const nameRegExp = /^[a-zA-Z]+$/;
        let birth = options.date_of_birth.split('-');
        birth[2] = birth[2].substring(0, 2);
        let now = new Date();
        let date_of_birth = new Date(birth[0], birth[1], birth[2]);
        return options.nick !== undefined
            && options.email !== undefined && options.password !== undefined && options.first_name !== undefined
            && options.last_name !== undefined && options.date_of_birth !== undefined && options.preferences !== undefined
            && options.gender !== undefined && mailRegExp.test(options.email) && usernameRegExp.test(options.nick)
            && passRegExp.test(options.password) && nameRegExp.test(options.first_name) && nameRegExp.test(options.last_name)
            && (now - date_of_birth)/31536000000 > 18.0 && (['Male', 'Female', 'Other'].indexOf(options.gender) !== -1);
    }catch (e){
        return false;
    }
}

function userCreate(nick, email, password, first_name, last_name,
                    date_of_birth, preferences,
                    gender, res){
    let pass = bcrypt.hashSync(password, 10);
    let userDetail = {
        nick: nick,
        email: email,
        password: pass,
        first_name: first_name,
        last_name: last_name,
        date_of_birth: new Date(date_of_birth),
        preferences: preferences,
        gender: gender,
    };
    let user = new User(userDetail);
    user.save(function (err) {
        if (err) {
            return convertResponse(responses.custom_error(err), res);
        }
        const payload = {
            id: user.id,
            nick: userDetail.nick,
            email: userDetail.email,
            password: userDetail.password
        }
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 86400}, (err, token) => {
            if(err) {
                return convertResponse(responses.custom_error(err), res);
            }
            return res.status(200).json({token: `Bearer ${token}`});
        });
    });
}

exports.update_user = function(req, res){
    if(req.body.nick!==undefined && (req.body.first_name!==undefined || req.body.last_name!==undefined || req.body.last_entered!==undefined)) {
        userUpdate(req.body.nick, req.body.first_name, req.body.last_name, req.body.last_entered)
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

async function userUpdate(nick_to_update, first_name, last_name, last_entered){
    let update = {};
    if(first_name) update.first_name = first_name;
    if(last_name) update.last_name = last_name;
    if(last_entered) {
        update.last_entered = parseInt(last_entered);
    }
    return User.updateOne(
        {nick: nick_to_update}, update);
}

exports.sign_out = function(req, res){
    req.logout(function(err){
        if(err) return convertResponse(responses.custom_error(err), res);
        else return convertResponse(responses.success, res);
    });
}

exports.delete_user = function(req, res){
    bcrypt.compare(req.body.password, req.user.password, function(err, isValid){
        if(err) {
            return convertResponse(responses.custom_error(err), res);
        }
        if(isValid){
            User.deleteOne({nick: req.body.nick}).then((result) => {
                if(result.acknowledged){
                    return convertResponse(responses.success, res);
                }else{
                    return convertResponse(responses.custom_error(result), res);
                }
            });
        }else{
            return convertResponse(responses.wrong_password, res);
        }
    });
}
