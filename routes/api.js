const express = require('express');
const router = express.Router();
const apiControllers = require('../controllers/apiControllers');
const userRouter = require('./api/users');
const unValidatedRouter = require('./api/verify');
const clubRouter = require('./api/clubs');
const adminRouter = require('./api/admin');
const subscriptionsRouter = require('./api/subscriptions');
const middleware = require('../middleware');


/* GET users listing. */
router.get('/', apiControllers.index);
router.get('/docs', middleware.isAuthenticated, middleware.adminsOnly, apiControllers.docs);
router.use('/users', userRouter);
router.use('/vcm', unValidatedRouter);
router.use('/clubs', clubRouter);
router.use('/admin', adminRouter);
router.use('/subscriptions', subscriptionsRouter);

module.exports = router;
