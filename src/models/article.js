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
        unique: true, trim: true  
    },
    author: { 
        name:{type:String, 
            required:true, trim: true,unique: false },
        email:{
            type:String, 
            required:true, trim: true, unique: false
        },
        unique: false
    },
    content: { 
        type: String, 
        required: true , trim: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Category', 
        required: true 
    },
    articlePictures: [
        {
            img: { type: String },
            imgLink: {type: String},
            imgSource: { type: String },
            imgSourceLink: { type: String }
        }
    ],
    minutesRead : {
        text: {type: String},
        minutes: {type: Number},
        time: {type: Number},
        words: {type: Number}
        // required: 'true'
    },
    shortText : {
        type: String, trim: 'true'
    },
    impressions : {type: Number, default: 0},
    updatedAt: Date ,
},{timestamps:true});

module.exports = mongoose.model('Article', articleSchema);