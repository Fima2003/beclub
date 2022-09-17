const User = require('../models/userModel');
const fs = require('fs');
const async = require('async');
const crypto = require('crypto');
const db = require('../db_setup');
const bcrypt = require('bcrypt');
/** FUNCTIONS FOR DUMMY DATA **/
exports.get_dummy_data = function(req, res, next){
    res.render('test/users/dummy_data_page', {
        title: "DummyData",
        baseRoute: ''
    });
}

exports.post_dummy_data = function(req, res, next){
    async.series([
        function(callback){
            userCreate(
                'fima__rubin', 'fima.rubin@gmail.com', 'qwertyuiop', 'Fima', 'Rubin',
                new Date(2003, 3, 22), './test_images/2020-09-09 13.26.04.jpg',
                ['Crypto', 'Tech', 'Music'], Date.now(), 0, false,
                'male', {number: "1923192319231923", expirationDate: "12/25"}, callback);
        },
        function(callback){
            userCreate(
                'taty.goldstein', 'tatty.goldstein@gmail.com', '1234567890', 'Taty', 'Goldstein',
                new Date(2001, 1, 12), './test_images/2020-12-16 16.16.46.jpg',
                ['Clothes', 'Erotics', 'Holidays'], Date.now(), 0, false,
                'female', {number: "1923192319231923", expirationDate: "12/25"}, callback);
        },
        function(callback){
            userCreate(
                'unggodded', 'spam.generous@gmail.com', '1q2w3e4r5t6y7u8i9o', 'Ung', 'Godded',
                new Date(1999, 12, 31), './test_images/2021-01-12 00.21.22.jpg',
                ['Concerts', 'Flights', 'Wonders'], Date.now(), 0, false,
                'male', false, callback);
        },
        function(callback){
            userCreate(
                'daone', 'closeenough@hotspace.com', 'poiuytrewq', 'Zhenya', 'Chopkis',
                new Date(1919, 10, 11), './test_images/2021-05-23 23.42.33.jpg',
                ['Concerts', 'Flights', 'Dancing'], Date.now(), 0, false,
                'female', false, callback);
        },
        function(callback){
            userCreate(
                'jesus', 'jesus@heavens.org', 'godforgives', 'Jesus', 'Christ',
                new Date(1959, 10, 16), './test_images/2021-05-23 23.42.50.jpg',
                ['Religion', 'Wine', 'Magic'], Date.now(), 0, false,
                'male', {number: "1923192319231923", expirationDate: "12/25"}, callback);
        },
        function(callback){
            userCreate(
                'obsolete', 'obsolete@brit.org', 'theone', 'Dan', 'Freed',
                new Date(1951, 5, 10), './test_images/2021-05-23 23.42.54.jpg',
                ['Concerts', 'Party', 'Travelling'], Date.now(), 0, false,
                'male', false, callback);
        },
    ])
        .then((r) => res.send('Successfully Uploaded'))
        .catch(err => res.send(err));
}

exports.delete_dummy_data = function(req, res, next){
    async.series([
        function(callback){
            deleteUser('fima__rubin', callback);
        },
        function(callback){
            deleteUser('taty.goldstein', callback);
        },
        function(callback){
            deleteUser('obsolete', callback);
        },
        function(callback){
            deleteUser('jesus', callback);
        },
        function(callback){
            deleteUser('daone', callback);
        },
        function(callback){
            deleteUser('unggodded', callback);
        }
    ])
        .then(r => res.send("Successfully Deleted"))
        .catch(err => res.send(err));
}

function userCreate(nick, email, password, first_name, last_name,
                    date_of_birth, imagePath, preferences,
                    last_entered, amount_of_subscriptions,
                    subscriptions, gender, creditCardDetails, cb){
    console.log("start userCreate");
    let id = crypto.createHash('sha256').update(nick).digest('hex');
    let pass = bcrypt.hashSync(password, 10);
    let userDetail = {
        _id: id,
        nick: nick,
        email: email,
        password: pass,
        first_name: first_name,
        last_name: last_name,
        date_of_birth: date_of_birth,
        image: {
            data: fs.readFileSync(imagePath),
            contentType: 'image/jpg'
        },
        preferences: preferences,
        gender: gender,
    };
    if(last_entered !== false) userDetail.last_entered = last_entered;
    if(amount_of_subscriptions !== false) userDetail.amount_of_subscriptions = amount_of_subscriptions;
    if(subscriptions !== false) userDetail.subscriptions = subscriptions;
    if(creditCardDetails !== false) userDetail.creditCard = creditCardDetails;
    console.log("Generated userDetail Object");
    let user = new User(userDetail);
    console.log("About to save");
    user.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        cb(null, user)
    });
}

function deleteUser(nick, cb){
    let id = crypto.createHash('sha256').update(nick).digest('hex');
    User.deleteOne({_id: id}, cb);
}
/** END OF FUNCTIONS FOR DUMMY DATA **/

exports.sign_up = function(req, res, next){
    let params = {
        title: "Sign Up",
        baseRoute: '',
        nick: 'fima__rubin',
        email: 'fima.rubin@gmail.com',
        password: 'qwertyuiop',
        first_name: 'Fima',
        last_name: 'Rubin',
        preferences: 'crypto,it,coding',
        gender: 'male'
    }
    res.render('test/users/sign_up', params);
}

exports.sign_in = function(req, res, next){
    let params = {
        title: "Sign in",
        baseRoute: '',
    }
    res.render('test/users/sign_in', params);
}

exports.get_user = function(req, res, next){
    let params = {
        title: "Get User",
        baseRoute: '',
        nick: 'fima__rubin'
    }
    console.log("Time to render");
    res.render('test/users/get', params);
}

exports.update_user = function(req, res, next){
    let params = {
        title: "Update",
        baseRoute: '',
        nick: 'fima__rubin',
        nick_to_update: 'fima__rubin',
        first_name: 'Jack',
        last_name: "Jonnas",
        last_online: '1659912553567',
        creditCardNumber: '1234567890123456',
        creditCardDate: '12/29',
    }
    res.render('test/users/update', params);
}

exports.sign_out = function(req, res, next){
    let params = {
        title: "Sign Out",
        baseRoute: ""
    }
    res.render('test/users/sign_out', params);
}

exports.delete_user = function(req, res, next){
    let params = {
        title: "Delete",
        baseRoute: "",
        nick: 'fima__rubin',
        password: 'qwertyuiop'
    };
    res.render('test/users/delete_user', params);

}

exports.create = function(req, res, next){
    let params = {
        baseRoute: '',
        nick: 'cluves',
        name: 'Cluves',
        website: 'cluves.com',
        support_email: 'support@cluves.com',
        price: 10,
        password: "qwertyuiop"
    }
    res.render('test/verify_club/create', params);
}

exports.verify = function(req, res, next){
    let params = {
        baseRoute: '',
        nick: 'gucci',
        name: 'gucci',
        website: 'website',
        support_email: 'support@gucci.com'
    }
    res.render('test/verify_club/verification', params);
}

exports.create_subscription = function(req, res){
    let params = {
        baseRoute: '',
        userId: '630cc4b3a22ac991bf239da5',
        clubId: '630cc5b2ce50eb26e62964f4',
    };
    res.render('test/subscriptions/create', params);
}