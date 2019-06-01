var express = require('express');
var router=express.Router();
// Get Category model
var Category=require('../models/category');
/*
* GET Category index
*/
router.get('/',function(req,res){
    Category.find(function(err,categories){
        if(err) return console.log(err);
        res.render('admin/categories',{
            categories:categories
        })
    })
})
/*
* GET add category
*/
router.get('/add-category',function(req,res){
    var title="";
    var slug="";
    var content="";
    res.render('admin/add_category',{
        title:title,
        slug:slug,
        content:content
    })})
/*
* POST add category
*/    
router.post('/add-category',function(req,res){
    req.checkBody('title','Title must have a value.').notEmpty();
    var title=req.body.title;
    var slug=title.replace(/\s+/g,'-').toLowerCase();
    var errors=req.validationErrors();
    if(errors){
        console.log('errors')
        res.render('admin/add_category',{
            errors:errors,  
            title:title
        });
    }else{
        Category.findOne({slug:slug},function(err,category){
            if(category){
                req.flash('danger','Page slug exits, choose another');
                res.render('admin/add_category',{
                    errors:errors,  
                    title:title,
                });
            }else{
                var category=new Category({
                    title:title,
                    slug:slug,
                });
                category.save(function(err){
                    if(err) return console.log(err);
                    req.flash('success','Category added!');
                    res.redirect('/admin/categories');
                });
            }
        });
    }
})
/*
* POST reorder pages
*/
router.post('/reorder-pages',function(req,res){
       //console.log(req.body)
       var ids = req.body['id[]'];
       var count = 0;
       for(var i = 0;i<ids.length;i++){
        var id=ids[i];
        count ++;
        // (function(count){
        //     Page.findById(id,function(err,page){
        //         page.sorting=count;
        //         page.save(function(err){
        //             if(err)
        //                 return console.log(err);
        //         });
        //     });
        // })(count);
       }
})
/*
* GET edit category
*/
router.get('/edit-category/:id',function(req,res){
    Category.findById(req.params.id,function(err,category){
        if(err)
        return console.log(err);
        res.render('admin/edit_category',{
            title:category.title,
            id:category._id
        })
    })
    })
    /*
* POST edit category
*/    
router.post('/edit-category/:id',function(req,res){
    req.checkBody('title','Title must have a value.').notEmpty();
    var title=req.body.title;
    var slug=title.replace(/\s+/g,'-').toLowerCase();
    var id = req.params.id;
    var errors=req.validationErrors();
    if(errors){
        console.log('errors')
        res.render('admin/edit_category',{
            errors:errors,  
            title:title,
            id:id
        });
    }else{
        Category.findOne({slug:slug,_id:{'$ne':id}},function(err,category){
            if(category){
                req.flash('danger','Category title exits, choose another');
                res.render('admin/edit_category',{  
                    title:title,
                    id:id
                });
            }else{
                Category.findById(id,function(err,category){
                    if(err) return console.log(err);
                    category.title=title;
                    category.slug=slug;
                    category.save(function(err){
                    if(err) return console.log(err);
                    req.flash('success','Category edited!');
                    res.redirect('/admin/categories/edit-category/'+id);
                });
                })
            }
        });
    }
})
/*
* GET delete page
*/
router.get('/delete-category/:id',function(req,res){
    Category.findByIdAndRemove(req.params.id,function(err){
        if(err) return console.log(err);
        req.flash('success','Category deleted');
        res.redirect('/admin/categories/')
    })
})
module.exports=router;