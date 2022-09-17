const express = require('express');
const router = express.Router();
const adminControllers = require('../../controllers/api/adminControllers');
const middleware = require('../../middleware');

router.get('/unVerifiedClubs',  middleware.isAuthenticated, middleware.adminsOnly, adminControllers.unVerifiedClubs);

module.exports = router;