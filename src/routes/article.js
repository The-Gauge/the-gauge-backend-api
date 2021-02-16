const express = require('express');
const { createProduct} = require('../controllers/article');
const multer = require('multer');
const {adminMiddleware , requireSignin} = require('../middleware/index')
const router = express.Router();
const shortid = require('shortid');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, '../uploads/')
    },
    filename: function (req, file, cb){
        cb(null, shortid.generate() + '-' + file.originalname)  
    }
})

const upload = multer({storage});

router.post('/article/create',requireSignin,adminMiddleware, upload.single('articlePicture'), createProduct);
// router.get('/category/getcategory',getCategories);

module.exports = router;