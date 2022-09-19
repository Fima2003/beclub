const express = require('express');
const router = express.Router();
const clubControllers = require('../../controllers/api/clubControllers');
const middleware = require('../../middleware');

router.post('/sign_in', clubControllers.sign_in);
router.post('/sign_out', middleware.isAuthenticated, clubControllers.sign_out);

router.get('/get_clubs', middleware.isAuthenticated, clubControllers.get_clubs);

router.get('/', middleware.isAuthenticated, clubControllers.get_club);
router.put('/', middleware.isAuthenticated, middleware.userOnly, clubControllers.update_club);
router.delete('/', middleware.isAuthenticated, middleware.userOnly, middleware.passwordRequired, clubControllers.delete_club);

module.exports = router;