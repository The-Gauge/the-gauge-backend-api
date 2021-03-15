const mongoose = require('mongoose');

const HomePageSchema = new mongoose.Schema({

  banners: [{
    articles: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'Article', 
      required: true 
    },
    
  }],
  sideGrid: [{
    articles: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'Article', 
      required: true 
    },
  }],
  featured : {
    articles: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'Article', 
      required: true 
    },
  }

}, { timestamps: true });


module.exports = mongoose.model('Home', HomePageSchema);