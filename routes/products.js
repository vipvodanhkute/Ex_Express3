var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Category = require('../models/category');
var fs = require('fs-extra');
var auth = require('../config/auth');
var isUser = auth.isUser;
/*
* GET all products
*/
router.get('/',isUser,function (req, res) {
    Product.find(function (err, products) {
        if (err)
            console.log(err);
        res.render('all_products', {
            title: 'All products',
            products: products
        });
    });
});
/*
* GET products by category
*/
router.get('/:category', function (req, res) {
    var categorySlug = req.params.category;
    Category.findOne({ slug: categorySlug }, function (err, c) {
        Product.find({category:categorySlug},function (err, products) {
            if (err)
                console.log(err);
            res.render('cat_products', {
                title:'All products',
                content: c.title,
                products: products
            });
        });
    })
});
/*
* GET products details
*/
router.get('/:category/:product', function (req, res) {
    var galleryImages=null;
    Product.findOne({slug:req.params.product},function(err,products){
        if(err){
        console.log(err)
        }else{
            var galleryDir='public/product_images/'+products._id+'/gallery';
            fs.readdir(galleryDir,function(err,files){
                if(err){
                    console.log(err);
                }else{
                    galleryImages=files;
                    res.render('product',{
                        title:products.title,
                        p:products,
                        galleryImages:galleryImages
                    })
                }
            });
        }
    })
});

module.exports = router;