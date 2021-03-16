const Article = require('../models/article');
const Category = require('../models/categories');
const shortid = require('shortid');
const homepage = require('../models/homePage');
const readingTime = require('reading-time');
const fs =  require('fs');
//const path = require('path');

const path = './src/uploads/';



function truncate(usertext) {
  var n = usertext.length;
  var c = 0;
  for (i = 0; i < n; i++) {
    if (usertext[i] == " ") {
      c++;
    }
  }
  var f = 12;
  if (c > 12) {
    var temText = "";
    for (i = 0; i < n; i++) {
      if (f > 0) {
        if (usertext[i] == " ") f--;
        temText += usertext[i];
      }
    }
    temText += "\b...";
    usertext = temText;
  }
  return usertext;
}

exports.createArticle = async (req,res) => {
    const { name, authorName, authorEmail, content, category, imgSource, imgSourceLink } = req.body;
    let articlePictures = [];
    
    if (req.files.length > 0) {
      articlePictures = req.files.map((file) => {
        
        return { 
          img: `${file.filename}`,
          imgLink: `/public/${file.filename}`,
          imgSource: imgSource,
          imgSourceLink: imgSourceLink
        };
        
      });
    }

    const author = {
      name: authorName,
      email: authorEmail
    }
    const stats = readingTime(content);
    const shortText = truncate(content);
    const article = new Article({
      name: name,
      slug: name,
      content,
      articlePictures,
      category,
      author: author,
      minutesRead : stats,
      shortText
    });
  
    await article.save((error, article) => {
      if (error) return res.status(400).json({ error });
      if (article) {
        res.status(201).json({ article, files: req.files });
      }
    });

};
  // new update
  exports.deleteArticle= async (req, res) => {
    const { articleId } = req.body;
    if (articleId) {
      const article = await Article.findById({_id: articleId}).lean();
      const img = article.articlePictures[0].img;
      fs.unlink(path+img ,(err) => {
        if (err){
          console.error(err);
          return;
        }
      })
      
      Article.deleteOne({ _id: articleId }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          res.status(202).json({ result });
        }
      });
    } else {
      res.status(400).json({ error: "Params required" });
    }
  };
  
  exports.getArticleDetailsById = (req, res) => {
    const { id } = req.params;
    if (id) {
      Article.findById({ _id: id}).exec((error, article) => {
        if (error) return res.status(400).json({ error });
        if (article) {
          res.status(200).json({ article });
          let newImpressions = article.impressions;
          newImpressions++;
          Article.findByIdAndUpdate(id, {impressions: newImpressions}, function (err, res){
            if(err){
              console.log(err)
            }
  
          });
        }
      });
    } else {
      res.status(400).json({ error: "Params required" });
    }
  };

  exports.getArticleByAuthor = async (req, res) => {
    const article = await Article.find({ author: req.user._id })
      .select("_id name author slug content articlePictures category")
      .populate({ path: "category", select: "_id name" })
      .exec();
  
    res.status(200).json({ article});
  };

  exports.getArticle = async (req, res) => {
    var article;
    if(req.query.search){
      console.log(req.query.search)
       article = await Article.find({ name: {$regex: req.query.search, $options: 'i'}})
      .select("_id name author slug content articlePictures")
      .populate("category", "_id name")
      // .populate("author", "_id firstName lastName")
    }
    else {article = await Article.find({})
      .select("_id name author slug content articlePictures")
      .populate("category", "_id name")
      // .populate("author", "_id firstName lastName")
      .exec();
    }
    res.status(200).json({ article });
  };

  exports.getArticleByCategory = async (req,res) => {
    const { id } = req.params;
    if (id) {
      Article.find({category: id}).exec((error, article) => {
        if (error) return res.status(400).json({ error });
        if (article) {
          res.status(200).json({ article });
        }
      });
    } else {
      return res.status(400).json({ error: "Params required" });
    } 
  };

  exports.getSideGridArticles = async (req,res) => {
    let articles = await Article.aggregate([
      {
        $group: {
          _id: "$category",
          //category: { $first: "$category" },
          name: { $first: "$name" },
          id: { $first: "$_id" },
          minutesRead: { $first: "$minutesRead" },
          shortText: { $first: "$shortText" },
        },
      },
      {
        $sort: { minutesRead: 1 },
      },
      {
        $lookup: {
          from: Category.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
    ]);

   //articles = await Article.distinct("category")
   //console.log(articles)
  //  for await (const doc of articles)
  //     console.log(doc); 
    return res.status(200).json(articles)

  }
  exports.temp = async (req,res) => {
    const { id } = req.params;
    if (id) {
      //.select('articlePistures[0].img')
      console.log(id)
      const imgLink = await Article.findById({_id: id}).lean();
      console.log(imgLink.articlePictures[0].img);
      return res.status(200).json({link: imgLink});
    } else {
      return res.status(400).json({ error: "Params required" });
    } 
  }

exports.getBannerArticles = async (req,res) => {
    const results = await Article
    .find({})
    .sort({
      impressions: -1,
    })
    .limit(4)
    if(results) {
      res.status(200).json({ results });
    }
    else
    {
      return res.status(400).json({ error: "error occurred" });
    }          
    // console.log('RESULTS:', results);  
}
