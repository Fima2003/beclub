var express = require('express');
var router = express.Router();
const responses = require('../responses');

router.get('/', function(req, res, next) {
  if(req.user) res.send(req.user);
  else res.send(responses.not_found);
});

module.exports = router;
