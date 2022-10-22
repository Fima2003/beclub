const Subscription = require("./subscriptions.model");
const User = require("../users/users.model");
const Club = require("../clubs/models/clubs.model");
const responses = require("../../utils/responses");
const mongoose = require("mongoose");
const { convertResponse } = require("../../utils/external_functions");

async function get_subscription(req, res) {
  const options = req.params.id;
  if (!options) {
    let result = await Subscription.findOne({ _id: options.id });
    if (!result) return convertResponse(responses.not_found, res);
    else return res.status(200).json({ results: result });
  } else {
    return convertResponse(responses.not_found, res);
  }
}

async function create_subscription(req, res) {
  const option = req.body;
  if (option.club && option.user) {
    let dbUser = await User.findOne({
      _id: mongoose.Types.ObjectId(option.user),
    });
    let dbClub = await Club.findOne({
      _id: mongoose.Types.ObjectId(option.club),
    });
    if (dbUser && dbClub) {
      let subscriptionDetails = {
        user: mongoose.Types.ObjectId(option.user),
        club: mongoose.Types.ObjectId(option.club),
      };
      const subscription = new Subscription(subscriptionDetails);
      subscription.save(function (err) {
        if (err) return convertResponse(responses.custom_error(err), res);
      });
      dbUser.subscriptions.push(subscription._id);
      dbClub.subscriptions.push(subscription._id);
      async.parallel(
        [
          async function (callback) {
            let userRes = await dbUser.save();
            callback(null, userRes);
          },
          async function (callback) {
            let clubRes = await dbClub.save();
            callback(null, clubRes);
          },
        ],
        function (err, results) {
          if (err) {
            return convertResponse(responses.custom_error(err));
          }
          return convertResponse(responses.success, res);
        }
      );
    } else {
      res.status(400).json({ user: dbUser, club: dbClub });
    }
  } else {
    return convertResponse(responses.not_all_fields, res);
  }
}

async function update_subscription(req, res) {
  const option = req.body;
  const id = req.params["id"];
  if (!id) {
    return convertResponse(responses.not_all_fields, res);
  }
  let dbSubscription = await Subscription.findOne({ _id: id });
  if (!dbSubscription) return convertResponse(responses.not_found, res);
  if (option.date_of_resubscription)
    dbSubscription.date_of_resubscription = option.date_of_resubscription;
  if (option.date_of_unsubscription)
    dbSubscription.date_of_unsubscription = option.date_of_unsubscription;
  let result = await dbSubscription.save();
  if (result) return res.status(200).json({ newSubscription: dbSubscription });
  else
    return convertResponse(
      responses.custom_error("Could not create a subscription"),
      res
    );
}

async function delete_subscription(req, res) {
  const id = req.params["id"];
  if (!id) {
    return convertResponse(responses.not_all_fields);
  }
  let result = await Subscription.deleteOne({ _id: id });
  if (result) convertResponse(responses.success, res);
  else
    convertResponse(responses.custom_error("Could not delete a subscription"));
}

module.exports = {
  get_subscription,
  create_subscription,
  update_subscription,
  delete_subscription,
};
