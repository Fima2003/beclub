/** This function creates a new club that needs to be verified.
 * Works only if there are no clubs with such nick
 *
 * Parameters: nick, name, website, support E-mail*/
const unVerified = require('../../models/unVerifiedClubsModel');
const Club = require('../../models/clubModel');
const responses = require('../../responses');
const bcrypt = require("bcrypt");
const db = require('../../db_setup');
const { convertResponse } = require('../../external_functions');

exports.create = async function(req, res){
    //TODO: implement verification for nicknames(both front and back end)

    let options = req.body;
    if (options['nick'] !== undefined && options['support_email'] !== undefined && options['website'] !== undefined && options['name'] !== undefined
        && options['password'] && options['type']) {
        let existsInClubDB = await Club.findOne({'nick': options['nick']});
        if(!existsInClubDB) {
            unVerified.findOne({'nick': options['nick']}, function (err, club) {
                if (err) return convertResponse(responses.custom_error(err), res);
                else if (!club) {
                    let clubOptions = {
                        nick: options['nick'],
                        support_email: options['support_email'],
                        website: options['website'],
                        name: options['name'],
                        type: options['type'],
                        password: options['password']
                    };
                    let unverifiedClub = new unVerified(clubOptions);
                    unverifiedClub.save(function (err) {
                        if (err) {
                            return convertResponse(responses.custom_error(err), res);
                        }
                        return convertResponse(responses.success, res);
                    });
                } else {
                    return convertResponse(responses.club_is_waiting_for_verification, res);
                }
            });
        }else{
            return convertResponse(responses.club_already_exists, res);
        }
    } else {
        return convertResponse(responses.not_all_fields, res);
    }
}

exports.verify = async function(req, res){
    let options = req.body;
    if(options['nick'] && options['website'] && options['support_email'] && options['name'] && options['password'] && options['type']){
        let pass = bcrypt.hashSync(options['password'], 10);
        let clubDefaults = {
            name: options['name'],
            nick: options['nick'],
            website: options['website'],
            support_email: options['support_email'],
            password: pass,
            type: options['type']
        };
        unVerified.deleteOne({nick: options['nick']}, function(err, obj){
            if(err) {
                return convertResponse(responses.custom_error(err), res);
            }
            let club = new Club(clubDefaults);
            club.save(async function(err){
                if(err) {
                    return convertResponse(responses.custom_error(err), res);
                }
                let results = await db.collection("unVerifiedClubs").find().toArray();
                return res.status(200).json({results: results});
            });
        });
    }else{
        return convertResponse(responses.not_all_fields, res);
    }
}

exports.unverify = function(req, res){
    let options = req.body;
    if(options['nick']){
        unVerified.deleteOne({nick: options['nick']}, async function(err, obj){
            if(err){
                return convertResponse(responses.custom_error(err), res);
            }
            let results = await db.collection("unVerifiedClubs").find().toArray();
            return res.status(200).json({results: results});
        });
    }else{
        return convertResponse(responses.not_all_fields, res);
    }
}