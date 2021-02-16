const auth = require('../controllers/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
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
      cb(null, nanoid() + '-' + file.originalname)
    }
});

const upload = multer({ storage });
const router = express.Router();
    
    router.post('/signup',validateSignupRequest,isRequestValidated,  auth.signup );
    router.post('/signin',validateSigninRequest,isRequestValidated, auth.signin);

    // Categories routes
    
    
    // articles control Routes

module.exports = router