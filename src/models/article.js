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
        required:true, trim: true },
        email:{
            type:String, 
            required:true, trim: true
        }
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
        {img:{type: String}}
    ],
    minutesRead : {
        type: Number, required: 'true'
    },
    shortText : {
        type: String, trim: 'true'
    },
    updatedAt: Date ,
    shortText : { type: String, required: true, trim: true }
},{timestamps:true});

module.exports = mongoose.model('Article', articleSchema);