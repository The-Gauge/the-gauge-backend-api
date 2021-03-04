const { signup, signin, signout }  = require('../controllers/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../validators/auth');
const { createArticle , deleteArticle, getArticleByAuthor,getArticle,getArticleDetailsById, getArticleByCategory, temp} = require('../controllers/article');
const { addCategory , getCategories} = require('../controllers/category');
//const {requireSignin} = require('../validators/auth');
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

    // Categories routes
    router.post('/category/create',requireSignin,adminMiddleware,addCategory);
    router.get('/category/getcategory',getCategories);
    
    // articles control Routes
    router.post('/article/create',requireSignin,adminMiddleware, upload.array('articlePictures'), createArticle);
    router.get('/article/:id',getArticleDetailsById);
    router.get('/article',getArticle);
    //router.get('/article/getarticleByAuthor',getArticleByAuthor);
    router.post('/article/delete',requireSignin,adminMiddleware, deleteArticle);
    router.get('/article/category/:id', getArticleByCategory);
    router.get('/temp/:id', temp)

   
module.exports = router;