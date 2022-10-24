const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const responses = require("../../utils/responses");
const Club = require("./models/clubs.model");
const { convertResponse } = require("../../utils/external_functions");
const Subscription = require("../subscriptions/subscriptions.model");

/** CRUD FOR CLUBS */
function get_club(req, res) {
  if (!req.query.nick) {
    return convertResponse(responses.not_all_fields, res);
  }
  if (req.club && req.club.nick === req.query.nick) {
    return res.status(200).json({ message: req.club });
  } else {
    Club.findOne({ nick: req.query.nick }, function (err, club) {
      if (err) {
        return convertResponse(responses.custom_error(err), res);
      }
      if (!club) return convertResponse(responses.not_found, res);
      if (club)
        res.status(200).json({
          nick: club.nick,
          name: club.name,
          website: club.website,
          promotions: club.promotions,
          profile_image: club.profile_image,
          type: club.type,
        });
    });
  }
}

function update_club(req, res) {
  if (
    req.body.nick !== undefined &&
    (req.body.subscriptions !== undefined ||
      req.body.comments !== undefined ||
      req.body.promotions !== undefined ||
      req.body.profileUrl !== undefined)
  ) {
    clubUpdate(
      req.body.nick,
      req.body.subscriptions,
      req.body.comments,
      req.body.propositions,
      req.body.profileUrl
    ).then((result) => {
      if (result.modifiedCount > 0 && result.acknowledged) {
        return convertResponse(responses.success, res);
      } else {
        return convertResponse(responses.custom_error(result), res);
      }
    });
  } else {
    return convertResponse(responses.not_all_fields, res);
  }
}

async function delete_club(req, res) {
  let club = await Club.findOne({ nick: req.params["nick"] });
  for (let subscription in club.subscriptions) {
    Subscription.deleteOne({ _id: subscription });
  }
  Club.deleteOne({ nick: req.body.nick }).then((result) => {
    if (result.acknowledged) {
      return convertResponse(responses.success, res);
    } else {
      return convertResponse(responses.custom_error(result), res);
    }
  });
}
/** END CRUD FOR CLUBS */
/** EXTRA ROUTES */
async function get_clubs_from_search(req, res) {
  if (!req.query.nick) {
    return convertResponse(responses.not_all_fields, res);
  }
  try {
    let clubs = await Club.find({ nick: { $regex: req.query.nick } })
      .limit(10)
      .select("nick profile_image type");
    return res.status(200).json({ clubs: clubs });
  } catch (e) {
    return convertResponse(responses.custom_error(e), res);
  }
}

async function get_clubs(req, res) {
  let amount = req.params["amount"];
  let clubs = await Club.find({}, { comments: { $slice: +amount } })
    .limit(amount)
    .select("nick support_email website name promotions topic");
  return res.status(200).json({ message: clubs });
}

async function sign_in(req, res) {
  const clubLoggingIn = req.body;
  console.log(clubLoggingIn);
  if (!clubLoggingIn.nickOrEmail || !clubLoggingIn.password) {
    return convertResponse(responses.not_all_fields, res);
  }
  let dbClub = await Club.find({
    $or: [
      { nick: clubLoggingIn.nickOrEmail },
      { support_email: clubLoggingIn.nickOrEmail },
    ],
  });
  if (!dbClub) {
    return convertResponse(responses.not_found, res);
  }
  bcrypt.compare(clubLoggingIn.password, dbClub.password).then((isCorrect) => {
    if (isCorrect) {
      const payload = {
        id: dbClub._id,
        nick: dbClub.nick,
        type: "club",
      };
      jwt.sign(payload, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) {
          return convertResponse(responses.custom_error(err), res);
        }
        return res.status(200).json({ token: `Bearer ${token}` });
      });
    } else {
      return convertResponse(responses.wrong_password, res);
    }
  });
}
/** END EXTRA ROUTES */

/** HELPING FUNCTIONS */
async function clubUpdate(
  nick_to_update,
  subscribers,
  comments,
  propositions,
  profileUrl
) {
  let update = {};
  if (subscribers) update["subscribers"] = subscribers;
  if (comments) update["comments"] = comments;
  if (propositions) update["propositions"] = propositions;
  if (profileUrl) update["profile_url"] = profileUrl;
  return Club.updateOne({ nick: nick_to_update }, update);
}
/** END HELPING FUNCTIONS */

module.exports = {
  delete_club,
  update_club,
  get_clubs,
  get_club,
  get_clubs_from_search,
  sign_in,
};
