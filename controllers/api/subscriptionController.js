const Subscription = require('../../models/subscriptionModel');
const User = require('../../models/userModel');
const Club = require('../../models/clubModel');
const responses = require('../../responses');
const mongoose = require('mongoose');
const { convertResponse } = require('../../external_functions');

exports.get_subscription = async function(req, res){
    const options = req.query;
    if(!options.id) {
        let result = await Subscription.findOne({_id: options.id});
        if (!result) return convertResponse(responses.not_found, res);
        return res.status(200).json({"results": result});
    }else{
        return convertResponse(responses.not_all_fields, res);
    }
}

exports.create_subscription = async function(req, res){
    const option = req.body;
    if (option.club && option.user) {
        let dbUser = await User.findOne({_id: mongoose.Types.ObjectId(option.user)});
        let dbClub = await Club.findOne({_id: mongoose.Types.ObjectId(option.club)});
        if(dbUser && dbClub) {
            let subscriptionDetails = {
                user: mongoose.Types.ObjectId(option.user),
                club: mongoose.Types.ObjectId(option.club)
            }
            const subscription = new Subscription(subscriptionDetails);
            subscription.save(function (err) {
                if (err) return convertResponse(responses.custom_error(err), res);
            });
            dbUser.subscriptions.push(subscription._id);
            dbClub.subscriptions.push(subscription._id);
            let userRes = await dbUser.save();
            let clubRes = await dbClub.save();
            if(userRes && clubRes)
                return convertResponse(responses.success, res);
        }else{
            res.status(400).json({user: dbUser, club: dbClub});
        }
    } else {
        return convertResponse(responses.not_all_fields, res)
    }
}

exports.update_subscription = async function(req, res){
    const option = req.body;
    if(!option.id && (!option.date_resubscribed || !option.date_unsubscribed)){
        return convertResponse(responses.not_all_fields, res);
    }
    let dbSubscription = await Subscription.findOne({_id: option.id});
    if(!dbSubscription) return convertResponse(responses.not_found, res);
    if(option.date_resubscribed) dbSubscription.date_of_resubscription = option.date_resubscribed;
    if(option.date_unsubscribed) dbSubscription.date_of_unsubscription = option.date_unsubscribed;
    let result = await dbSubscription.save();
    if(result) return res.status(200).json({newSubscription: dbSubscription});
}