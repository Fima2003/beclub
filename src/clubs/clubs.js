const express = require('express');
const router = express.Router();
const clubControllers = require('./clubs.controllers');
const clubMiddleware = require('../middleware/clubMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const verifyControllers = require('./verify_clubs.controller');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', clubMiddleware.authenticate, clubControllers.get_club);
router.put('/', clubMiddleware.isAuthenticated, clubMiddleware.clubOnly, clubControllers.update_club);
router.delete('/', clubMiddleware.isAuthenticated, clubMiddleware.clubOnly, clubControllers.delete_club);

router.post('/sign_in', clubControllers.sign_in);
router.post('/sign_out', clubMiddleware.isAuthenticated, clubControllers.sign_out);

router.get('/get_clubs', userMiddleware.isAuthenticated, clubControllers.get_clubs);

router.post('/create_verification', verifyControllers.create);
router.post('/verify', userMiddleware.isAuthenticated, adminMiddleware.adminsOnly, verifyControllers.verify);
router.post('/reject', userMiddleware.isAuthenticated, adminMiddleware.adminsOnly, verifyControllers.reject);
router.get('/get_all_unverified_clubs', userMiddleware.isAuthenticated, adminMiddleware.adminsOnly, verifyControllers.getAllClubsForVerification);

module.exports = router;