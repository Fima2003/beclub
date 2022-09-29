const express = require('express');
const router = express.Router();
const userControllers = require('../../controllers/api/userControllers');
const middleware = require('../../middleware/userMiddleware');

router.post('/sign_in', userControllers.sign_in);
router.post('/sign_out', middleware.isAuthenticated, userControllers.sign_out);

router.get('/', middleware.isAuthenticated, userControllers.get_user);
router.post('/', userControllers.create_user);
router.put('/', middleware.isAuthenticated, middleware.userOnly, userControllers.update_user);
router.delete('/', middleware.isAuthenticated, middleware.userOnly, userControllers.delete_user);

module.exports = router;