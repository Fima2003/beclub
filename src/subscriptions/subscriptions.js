const express = require('express');
const router = express.Router();
const middleware = require('../middleware/userMiddleware');
const subscriptionController = require('./subscriptions.controller');

router.get('/:id', middleware.isAuthenticated, middleware.userOnly, subscriptionController.get_subscription);
router.post('/create_subscription', subscriptionController.create_subscription);
router.put('/:id', subscriptionController.update_subscription);
router.delete('/:id', subscriptionController.delete_subscription);

module.exports = router;