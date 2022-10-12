const express = require('express');
const router = express.Router();
const userControllers = require('./users.controllers');
const userMiddleware = require('../middleware/userMiddleware');

router.post('/sign_in', userControllers.sign_in);
router.post('/sign_out', userMiddleware.isAuthenticated, userControllers.sign_out);

router.get('/self', userMiddleware.isAuthenticated, userControllers.get_user);
router.post('/create-user', userControllers.create_user);
router.put('/:nick', userMiddleware.isAuthenticated, userMiddleware.userOnly, userControllers.update_user);
router.delete('/:nick', userMiddleware.isAuthenticated, userMiddleware.userOnly, userControllers.delete_user);

module.exports = router;