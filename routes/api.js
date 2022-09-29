const express = require('express');
const router = express.Router();
const apiControllers = require('../controllers/apiControllers');
const userRouter = require('./api/users');
const unValidatedRouter = require('./api/verify');
const clubRouter = require('./api/clubs');
const adminRouter = require('./api/admin');
const subscriptionsRouter = require('./api/subscriptions');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/* GET users listing. */
router.get('/', apiControllers.index);
router.get('/docs', userMiddleware.isAuthenticated, adminMiddleware.adminsOnly, apiControllers.docs);
router.use('/users', userRouter);
router.use('/vcm', unValidatedRouter);
router.use('/clubs', clubRouter);
router.use('/admin', adminRouter);
router.use('/subscriptions', subscriptionsRouter);

module.exports = router;
