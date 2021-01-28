const mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    id: { type: int, required: true, unique: true },
    slug: { type:String, required:true, unique: true },
    author: { type:String, required:true, unique: true },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    articlePictures: [
        {img:{type: String}}
    ],
},{timestamps:true});

module.exports = mongoose.model('Article', categorySchema);