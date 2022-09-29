const express = require('express');
const router = express.Router();
const adminControllers = require('../../controllers/api/adminControllers');
const userMiddleware = require('../../middleware/userMiddleware');
const adminMiddleware = require('../../middleware/adminMiddleware');

router.get('/unVerifiedClubs',  userMiddleware.isAuthenticated, adminMiddleware.adminsOnly, adminControllers.unVerifiedClubs);

module.exports = router;