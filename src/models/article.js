const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    name: { 
       type: String, 
       required: true, 
       trim: true 
    },
    slug: { 
        type:String, 
        required:true, 
        unique: true 
    },
    author: { 
        type:String, 
        required:true, 
        unique: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Category', 
        required: true 
    },
    articlePictures: [
        {img:{type: String}},
        {imgSource: {type: String}},
        {imgSourceLink: {type: String} }
    ],
    updatedAt: Date 
},{timestamps:true});

module.exports = mongoose.model('Article', articleSchema);