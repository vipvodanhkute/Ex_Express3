var express = require('express');
var router=express.Router();
var Page=require('../models/page');
/*
* GET /
*/
router.get('/',function(req,res){
    Page.findOne({slug:'home'},function(err,page){
        if(err)
        console.log(err);
        res.render('index',{
            title:page.title,
            content:page.content
        })
    })
})
/*
* GET a page
*/
router.get('/:slug',function(req,res){
    Page.findOne({slug:req.params.slug},function(err,page){
        if(err)
        console.log(err);
        if(!page){
            res.redirect('/')
        }else{
            res.render('index',{
                title:page.title,
                content:page.content
            })
        }
    })
})
module.exports=router;