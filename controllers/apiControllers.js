const path = require('path');
const responses = require("../responses");

exports.index = function(req, res, next){
    res.send(responses.success);
}

exports.docs = function(req, res, next){
    res.render('docs');
}

exports.post_docs = function(req, res, next){
    if(req.body.password === 'wo2Quaz7l_d51yo01ulizPakeaVx1cupoftea' && req.body.nickname === 'admin'){
        res.render('api');
    }else{
        res.render('fuckoff');
    }
}