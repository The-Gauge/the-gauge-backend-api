const Article = require('../models/article');
const Category = require('../models/categories');
const shortid = require('shortid');
const readingTime = require('reading-time');

exports.createArticle = async (req,res) => {
    const { name, authorName, authorEmail, content, category, imgSource, imgLink } = req.body;
    let articlePictures = [];
    
    if (req.files.length > 0) {
      articlePictures = req.files.map((file) => {
        
        return { 
          img: `/public/${file.filename}`,
          imgSource: imgSource,
          imgSourceLink: imgLink
        };
        
      });
    }
    const author = {
      name: authorName,
      email: authorEmail
    }
    const stats = readingTime(content);
    const article = new Article({
      name: name,
      slug: name,
      content,
      articlePictures,
      category,
      author: author,
      minutesRead : stats
    });
  
    await article.save((error, article) => {
      if (error) return res.status(400).json({ error });
      if (article) {
        res.status(201).json({ article, files: req.files });
      }
    });

};
  // new update
  exports.deleteArticle= (req, res) => {
    const { articleId } = req.body.payload;
    if (articleId) {
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
    const { articleId } = req.params;
    if (articleId) {
      Article.findOne({ _id: articleId }).exec((error, article) => {
        if (error) return res.status(400).json({ error });
        if (article) {
          res.status(200).json({ article });
        }
      });
    } else {
      return res.status(400).json({ error: "Params required" });
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
      .populate("author", "_id firstName lastName")
    }
    else {article = await Article.find({})
      .select("_id name author slug content articlePictures")
      .populate("category", "_id name")
      .populate("author", "_id firstName lastName")
      .exec();
    }
    res.status(200).json({ article });
  };

  exports.getArticleByCategory = async (res,req) => {
    const { categoryId } = req.params;
    if (categoryId) {
      Article.find({category: categoryId }).exec((error, article) => {
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
  };