const Category = require('../models/categories');
const slugify = require ('slugify');

function createCategories(categories,parentId = null){

    const categoryList = [];
    if(parentId == null)
    {
        category =  catergories.filter(cat => cat.parentId == underfined);
    }else{
        category = categories.filter(cat => cat.parentId == parentId);

    }
    for(let cate of category){
        categoryList.push({
           _id:cate._id,
           name:cate.name,
           slug:cate.slug,
           children:createCategories(categories, cate._id)
        });
    }

    return categoryList;
};

exports.addCategory = (req,res)=>{
   
    const categoryObj = {
        name: req. body.name,
        slug: slugify(req.body.name)
    }

    if(req.body.parentId){
        categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj)
    cat.save((error, category)=>{
     if(error) return res.status(400).json({error});
     if(category){
         return res.status(201).json({category});
     }
    });
}
exports.getCategories = (req,res) =>{
    Category.find({})
    .exec((error,catergories)=>{
        if(error) return res.status(400).json({error});
        if(catergories){
            const categoryList = createCategories(categories);
            res.status(200).json({ categoryList });
        }
    });
}