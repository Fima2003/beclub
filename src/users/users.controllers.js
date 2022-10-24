const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./users.model");
const responses = require("../../utils/responses");
const { convertResponse } = require("../../utils/external_functions");
const Subscription = require("../subscriptions/subscriptions.model");

/** CRUD FOR USER */
function get_user(req, res) {
  res.status(200).json(req.user);
}

async function create_user(req, res) {
  let options = req.body;
  if (!requiredExists(options)) {
    return convertResponse(responses.not_all_fields, res);
  }
  let takenNick = await User.findOne({ nick: options.nick });
  let takenMail = await User.findOne({ email: options.email });
  if (takenNick || takenMail) {
    return convertResponse(responses.user_already_exists, res);
  }
  userCreate(options, res);
}

function update_user(req, res) {
  if (
    req.body.nick !== undefined &&
    (req.body.first_name !== undefined ||
      req.body.last_name !== undefined ||
      req.body.last_entered !== undefined)
  ) {
    userUpdate(req.body).then((result) => {
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

async function delete_user(req, res) {
  let user = await User.findOne({ nick: req.params["nick"] });
  for (let subscription in user.subscriptions) {
    await Subscription.deleteOne({ _id: subscription });
  }
  User.deleteOne({ nick: req.params["nick"] }).then((result) => {
    if (result.acknowledged) {
      return convertResponse(responses.success, res);
    } else {
      return convertResponse(responses.custom_error(result), res);
    }
  });
}
/** END CRUD FOR USER */

/** EXTRA ROUTES */
function sign_in(req, res) {
  const userLoggingIn = req.body;
  if (!userLoggingIn.nick || !userLoggingIn.password) {
    return convertResponse(responses.not_all_fields, res);
  }
  User.findOne({
    $or: [{ nick: userLoggingIn.nick }, { email: userLoggingIn.nick }],
  }).then((dbUser, err) => {
    if (err !== undefined) {
      return convertResponse(responses.custom_error(err), res);
    }
    if (!dbUser) {
      return convertResponse(responses.not_found, res);
    }
    bcrypt
      .compare(userLoggingIn.password, dbUser.password)
      .then((isCorrect) => {
        if (isCorrect) {
          const payload = {
            id: dbUser._id,
            nick: dbUser.nick,
            email: dbUser.email,
            type: dbUser.type,
          };
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 86400 },
            (err, token) => {
              if (err) {
                return convertResponse(responses.custom_error(err), res);
              }
              return res
                .status(200)
                .json({ token: `Bearer ${token}`, user: payload });
            }
          );
        } else {
          return convertResponse(responses.wrong_password, res);
        }
      });
  });
}

async function get_users(req, res) {
  let amount = req.params["amount"];
  let users = await User.find({}, { comments: { $slice: +amount } })
    .limit(amount)
    .select(
      "nick email first_name last_name date_of_birth preferences gender type subscriptions"
    );
  return res.status(200).json({ message: users });
}
/** END EXTRA ROUTES */

/** HELPING FUNCTIONS */
function requiredExists(options) {
  try {
    const mailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const usernameRegExp = /^[a-z0-9._]{3,12}$/;
    const passRegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.])[A-Za-z\d@$!%*?&_.]{8,}$/;
    const nameRegExp = /^[a-zA-Z]+$/;
    let birth = options.date_of_birth.split("-");
    birth[2] = birth[2].substring(0, 2);
    let now = new Date();
    let date_of_birth = new Date(birth[0], birth[1], birth[2]);
    return (
      options.nick !== undefined &&
      options.email !== undefined &&
      options.password !== undefined &&
      options.first_name !== undefined &&
      options.last_name !== undefined &&
      options.date_of_birth !== undefined &&
      options.preferences !== undefined &&
      options.gender !== undefined &&
      mailRegExp.test(options.email) &&
      usernameRegExp.test(options.nick) &&
      passRegExp.test(options.password) &&
      nameRegExp.test(options.first_name) &&
      nameRegExp.test(options.last_name) &&
      (now - date_of_birth) / 31536000000 > 18.0 &&
      ["Male", "Female", "Other"].indexOf(options.gender) !== -1
    );
  } catch (e) {
    return false;
  }
}

function userCreate(
  {
    nick,
    email,
    password,
    first_name,
    last_name,
    date_of_birth,
    preferences,
    gender,
    type,
  },
  res
) {
  let pass = bcrypt.hashSync(password, 10);
  let userDetail = {
    nick: nick,
    email: email,
    password: pass,
    first_name: first_name,
    last_name: last_name,
    date_of_birth: new Date(date_of_birth),
    preferences: preferences.split(","),
    gender: gender,
  };
  if (type) userDetail["type"] = type;
  let user = new User(userDetail);
  user.save(function (err) {
    if (err) {
      return convertResponse(responses.custom_error(err), res);
    }
    const payload = {
      id: user.id,
      nick: userDetail.nick,
      email: userDetail.email,
      type: userDetail.type,
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 86400 },
      (err, token) => {
        if (err) {
          return convertResponse(responses.custom_error(err), res);
        }
        return res.status(200).json({ token: `Bearer ${token}` });
      }
    );
  });
}

async function userUpdate({
  nick_to_update,
  first_name,
  last_name,
  last_entered,
}) {
  let update = {};
  if (first_name) update.first_name = first_name;
  if (last_name) update.last_name = last_name;
  if (last_entered) {
    update.last_entered = parseInt(last_entered);
  }
  return User.updateOne({ nick: nick_to_update }, update);
}
/** END HELPING FUNCTIONS */
module.exports = {
  sign_in,
  get_user,
  create_user,
  update_user,
  delete_user,
  get_users,
};
