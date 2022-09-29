var express = require('express');
var router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const indexControllers = require('../controllers/indexControllers');

router.get('/', userMiddleware.isAuthenticated, indexControllers.index);
router.get('/admin-panel', adminMiddleware.adminsOnly, indexControllers.adminPanel);

module.exports = router;
