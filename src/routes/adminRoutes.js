const { signup, signin, signout }  = require('../controllers/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const { createArticle , deleteArticle, getArticle} = require('../controllers/article');
const {adminMiddleware , requireSignin} = require('../middleware/index');
const { addCategory , getCategories} = require('../controllers/category');
// const {requireSignin} = require('../validators/auth');
//const {adminMiddleware , requireSignin} = require('../middleware/index');
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
    
    router.post('/signup',validateSignupRequest,isRequestValidated, signup );
    router.post('/signin',validateSigninRequest,isRequestValidated, signin);
    router.post('/admin/signout', signout)

    // Categories routes
    router.post('/category/create',requireSignin,adminMiddleware,addCategory);
    router.get('/category/getcategory',getCategories);
    
    // articles control Routes
    router.post('/article/create',requireSignin,adminMiddleware, upload.single('articlePicture'), createArticle);
    router.get('/category/getcategory',getArticle);
    router.post('/article/create',requireSignin,adminMiddleware, deleteArticle);

   
module.exports = router;