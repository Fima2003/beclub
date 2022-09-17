const express = require('express');
const router = express.Router();
const unValidatedControllers = require('../../controllers/api/unVerifiedClubsControllers');
const middleware = require('../../middleware');

router.post('/create', unValidatedControllers.create);
router.post('/verify', middleware.isAuthenticated, middleware.adminsOnly ,unValidatedControllers.verify);
router.post('/unverify', middleware.isAuthenticated, middleware.adminsOnly ,unValidatedControllers.unverify);

module.exports = router;