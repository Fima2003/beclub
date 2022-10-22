const unVerified = require("./models/verify_clubs.model");
const Club = require("./models/clubs.model");
const responses = require("../../utils/responses");
const bcrypt = require("bcrypt");
const db = require("../../utils/db_setup");
const { convertResponse } = require("../../utils/external_functions");

async function create(req, res) {
  //TODO: implement verification for nicknames(both front and back end)

  let options = req.body;
  if (
    options["nick"] !== undefined &&
    options["support_email"] !== undefined &&
    options["website"] !== undefined &&
    options["name"] !== undefined &&
    options["password"] !== undefined &&
    options["topic"] !== undefined
  ) {
    let existsInClubDB = await Club.findOne({ nick: options["nick"] });
    if (!existsInClubDB) {
      unVerified.findOne({ nick: options["nick"] }, function (err, club) {
        if (err) return convertResponse(responses.custom_error(err), res);
        else if (!club) {
          let clubOptions = {
            nick: options["nick"],
            support_email: options["support_email"],
            website: options["website"],
            name: options["name"],
            password: options["password"],
            topic: options["topic"].split(","),
          };
          let unverifiedClub = new unVerified(clubOptions);
          unverifiedClub.save(function (err) {
            if (err) {
              return convertResponse(responses.custom_error(err), res);
            }
            return convertResponse(responses.success, res);
          });
        } else {
          return convertResponse(
            responses.club_is_waiting_for_verification,
            res
          );
        }
      });
    } else {
      return convertResponse(responses.club_already_exists, res);
    }
  } else {
    return convertResponse(responses.not_all_fields, res);
  }
}

async function verify(req, res) {
  let options = req.body;
  if (
    options["nick"] &&
    options["website"] &&
    options["support_email"] &&
    options["name"] &&
    options["password"] &&
    options["topic"]
  ) {
    let pass = bcrypt.hashSync(options["password"], 10);
    let clubDefaults = {
      name: options["name"],
      nick: options["nick"],
      website: options["website"],
      support_email: options["support_email"],
      password: pass,
      topic: options["topic"],
    };
    unVerified.deleteOne({ nick: options["nick"] }, function (err, obj) {
      if (err) {
        return convertResponse(responses.custom_error(err), res);
      }
      let club = new Club(clubDefaults);
      club.save(async function (err) {
        if (err) {
          return convertResponse(responses.custom_error(err), res);
        }
        let results = await db.collection("unVerifiedClubs").find().toArray();
        return res.status(200).json({ results: results });
      });
    });
  } else {
    return convertResponse(responses.not_all_fields, res);
  }
}

function reject(req, res) {
  let options = req.body;
  if (options["nick"]) {
    unVerified.deleteOne({ nick: options["nick"] }, async function (err, obj) {
      if (err) {
        return convertResponse(responses.custom_error(err), res);
      }
      let results = await db.collection("unVerifiedClubs").find().toArray();
      return res.status(200).json({ results: results });
    });
  } else {
    return convertResponse(responses.not_all_fields, res);
  }
}

async function getAllClubsForVerification(req, res) {
  try {
    let results = await db
      .collection("unVerifiedClubs")
      .find()
      .limit(50)
      .toArray();
    convertResponse({ code: 200, message: results }, res);
  } catch (e) {
    convertResponse(responses.custom_error(e), res);
  }
}

module.exports = {
  verify,
  getAllClubsForVerification,
  reject,
  create,
};
