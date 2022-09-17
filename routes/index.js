var express = require('express');
var router = express.Router();
const responses = require('../responses');
const middleware = require('../middleware');
const indexControllers = require('../controllers/indexControllers');

router.get('/', middleware.isAuthenticated, indexControllers.index);
router.get('/admin-panel', middleware.adminsOnly, indexControllers.adminPanel);

module.exports = router;
