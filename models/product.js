var mongoose=require('mongoose');

// Page Schema
var ProductSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
    }, 
    desc:{
        type:String,
        required:true
    }, 
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    images:{
        type:String
    }
})
var Product=module.exports=mongoose.model('Products',ProductSchema)