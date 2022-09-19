const express = require('express');
const router = express.Router();
const clubControllers = require('../../controllers/api/clubControllers');
const middleware = require('../../middleware');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const passport = require("passport");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const root = path.join('uploads');
        if(fs.existsSync('uploads')){
            fs.mkdirSync(root);
        }
        const destination = path.join('uploads', req.body.nick);
        if(!fs.existsSync((destination))){
            console.log(`${destination} Does not exist, have to create it`);
            fs.mkdirSync(destination);
        }
        cb(null, destination);
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + Math.round(Math.random()*1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
    }
});

const upload = multer({
    storage: storage
});

router.post('/sign_in', clubControllers.sign_in);
router.post('/sign_out', middleware.isAuthenticated, clubControllers.sign_out);

router.get('/get_clubs', middleware.isAuthenticated, clubControllers.get_clubs);

router.get('/', middleware.isAuthenticated, clubControllers.get_club);
router.put('/', middleware.isAuthenticated, middleware.userOnly, upload.single('profile_pic'), clubControllers.update_club);
router.delete('/', middleware.isAuthenticated, middleware.userOnly, clubControllers.delete_club);

module.exports = router;