const Article = require('../models/article');
const shortid = require('shortid');
exports.createArticle = (req,res) => {
    const { name, author, content, category } = req.body;
    let articlePictures = [];
  
    if (req.files.length > 0) {
      articlePictures = req.files.map((file) => {
        return { img: file.location };
      });
    }
  
    const article = new Article({
      name: name,
      slug: slugify(name),
      content,
      articlePictures,
      category,
      author: req.user._id,
    });
  
    article.save((error, article) => {
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
  
  exports.getArticle = async (req, res) => {
    const article = await Article.find({ author: req.user._id })
      .select("_id name author slug content articlePictures category")
      .populate({ path: "category", select: "_id name" })
      .exec();
  
    res.status(200).json({ article});
  }