const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const passport = require('passport');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const root = path.join('uploads');
        if(!fs.existsSync('uploads')){
            fs.mkdirSync(root);
        }
        const destination = path.join('uploads', req.body.nick);
        if(!fs.existsSync(destination)){
            console.log(`${destination} Does not exist, have to create it`);
            fs.mkdirSync(destination);
        }
        cb(null, `uploads/${req.body.nick}`);
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + Math.round(Math.random()*1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
    }
});

const upload = multer({
    storage: storage
});

router.post('/sign_in', passport.authenticate('local', {
    failureRedirect: '/api/sign_in',
    successRedirect: '/'
}), userControllers.sign_in);
router.post('/sign_out', userControllers.sign_out);

router.get('/:nick', userControllers.get_user);
router.post('/:nick', upload.single('profile_pic'), userControllers.create_user);
router.put('/:nick', upload.single('profile_pic'), userControllers.update_user);
router.delete('/:nick', userControllers.delete_user);

module.exports = router;