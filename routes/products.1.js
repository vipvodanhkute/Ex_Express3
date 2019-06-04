var express = require('express');
var router = express.Router();
var Product = require('../models/product');
/*
* GET all products
*/
router.get('/', function (req, res) {
    Product.find(function (err, products) {
        if (err)
            console.log(err);
        res.render('all_products', {
            title: 'All products',
            content: products.content,
            products: products
        });
    });
});
/*
* GET products by category
*/
router.get('/:category', function (req, res) {
    var categorySlug = req.params.category;
    Categoty.findOne({ slug: categorySlug }, function (err, c) {
        Product.find({category:categorySlug},function (err, products) {
            if (err)
                console.log(err);
            res.render('cat_products', {
                title: 'All products',
                content: c.title,
                products: products
            });
        });
    })
});

module.exports = router;