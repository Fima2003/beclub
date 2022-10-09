const express = require('express');
const router = express.Router();
const middleware = require('../middleware/userMiddleware');
const subscriptionController = require('./subscriptions.controller');

router.get('/', middleware.isAuthenticated, middleware.userOnly, subscriptionController.get_subscription);
router.post('/', subscriptionController.create_subscription);
router.put('/');

module.exports = router;