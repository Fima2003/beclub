var express = require('express');
var router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const indexControllers = require('./indexControllers');

router.get('/', userMiddleware.isAuthenticated, indexControllers.index);

module.exports = router;
