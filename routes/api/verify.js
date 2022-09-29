const express = require('express');
const router = express.Router();
const unValidatedControllers = require('../../controllers/api/unVerifiedClubsControllers');
const userMiddleware = require('../../middleware/userMiddleware');
const adminMiddleware = require('../../middleware/adminMiddleware');

router.post('/create', unValidatedControllers.create);
router.post('/verify', userMiddleware.isAuthenticated, adminMiddleware.adminsOnly ,unValidatedControllers.verify);
router.post('/unverify', userMiddleware.isAuthenticated, adminMiddleware.adminsOnly ,unValidatedControllers.unverify);

module.exports = router;