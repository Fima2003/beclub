const express = require('express');
const router = express.Router();
const clubControllers = require('../../controllers/api/clubControllers');
const clubMiddleware = require('../../middleware/clubMiddleware');
const userMiddleware = require('../../middleware/userMiddleware');

router.get('/', userMiddleware.isAuthenticated, clubControllers.get_club);
router.put('/', clubMiddleware.isAuthenticated, clubMiddleware.clubOnly, clubControllers.update_club);
router.delete('/', clubMiddleware.isAuthenticated, clubMiddleware.clubOnly, clubControllers.delete_club);

router.post('/sign_in', clubControllers.sign_in);
router.post('/sign_out', clubMiddleware.isAuthenticated, clubControllers.sign_out);

router.get('/get_clubs', userMiddleware.isAuthenticated, clubControllers.get_clubs);

module.exports = router;