const express = require('express');
const router = express.Router();
const testController = require('../controllers/testControllers');

/** USERS **/
router.get('/generate', testController.get_dummy_data);
router.post('/generate', testController.post_dummy_data);
router.delete('/generate', testController.delete_dummy_data);

router.get('/sign_up', testController.sign_up);
router.get('/sign_in', testController.sign_in);

router.get('/get_user', testController.get_user);
router.get('/update_user', testController.update_user);
router.get('/delete_user', testController.delete_user);

router.get('/sign_out', testController.sign_out);

/** VERIFY CLUBS **/
router.get('/create', testController.create);
router.get('/verify', testController.verify);

/** SUBSCRIPTION */
router.get('/create_subscription', testController.create_subscription);

module.exports = router;