const { signup, signin, signout }  = require('../controllers/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');

const {adminMiddleware , requireSignin} = require('../middleware/index');
const express = require('express');
const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');


//Storage for File storing
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, nanoid(8) + '-' + file.originalname)
    }
});

const upload = multer({ storage });
const router = express.Router();
    
    router.post('/signup',validateSignupRequest,isRequestValidated, signup);
    router.post('/signin',validateSigninRequest,isRequestValidated, signin);
    router.post('/signout', signout)

module.exports = router;