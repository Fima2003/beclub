const express = require('express');
const router = express.Router();
const userRouter = require('../routes/users');
const apiControllers = require('../controllers/apiControllers');


/* GET users listing. */
router.get('/', apiControllers.index);
router.get('/docs', apiControllers.docs);
router.post('/docs', apiControllers.post_docs);
router.use('/users', userRouter);

module.exports = router;
