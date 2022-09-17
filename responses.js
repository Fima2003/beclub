exports.success = {code: 200, message: "Success"};

exports.not_all_fields = {code: 700, message: "Not all fields"};

exports.not_authorized = {code: 401, message: "Not Authorized"};

exports.forbidden = {code: 403, message: "Forbidden"};

exports.not_found = {code: 404, message: "Not Found"};

exports.user_already_exists = {code: 703, message: "User Already Exists"};

exports.wrong_password = {code: 704, message: "Wrong Password"};

exports.club_is_waiting_for_verification = {code: 705, message: "Club is already waiting for verification"};

exports.club_already_exists = {code: 706, message: "Club already exists"};

exports.custom_error = (err) => {
    return {code: 750, message: err};
}