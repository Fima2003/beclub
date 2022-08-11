exports.success = {code: 200, message: "Success"};

exports.not_all_fields = {code: 700, error: "Not all fields"};

exports.not_authorized = {code: 701, error: "Not Authorized"};

exports.not_found = {code: 702, error: "Not Found"};

exports.already_exists = {code: 703, error: "User Already Exists"};

exports.wrong_password = {code: 704, error: "Wrong Password"};

exports.custom_error = (err) => {
    return {code: 750, message: "Custom Error", error: err};
}