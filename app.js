var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var passport = require('passport');
// Connect to db
//mongoose.connect('mongodb://localhost/Ex_Express3')
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connect to MongoDB");
});
// Init app
var app = express();
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Set global errors variable
app.locals.errors = null;
// Get Page Model
var Page=require('./models/page');
// Get all pages to pass to header.ejs
Page.find({}).sort({sorting:1}).exec(function (err,pages){
  if(err){
    console.log(err);
  }else{
    app.locals.pages=pages;
  }
}); 
// Get Category Model
var Category=require('./models/category');
// Get all categories to pass to header.ejs
Category.find(function (err,categories){
  if(err){
    console.log(err);
  }else{
    app.locals.categories=categories;
  }
}); 
// BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
// BodyParser json
app.use(bodyParser.json());
// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,//flase
  saveUninitialized: true,
  //cookie: { secure: true }
}))
// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// Express validator middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {  
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      var extension = (path.extname(filename)).toLowerCase();
      console.log(extension);
      switch (extension) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default :
        return false;
      }
    }
  }
}))
// Express fileUpload middleware
app.use(fileUpload());
// Express Message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// chua hiu
app.get('*',function(req,res,next){
  res.locals.cart=req.session.cart;
  res.locals.user=req.user || null;
  //console.log(res.locals.cart);
  next();
})
// Set public folder
app.use(express.static(path.join(__dirname, 'public')));
//Set routes
var pages = require('./routes/pages.js');
var products = require('./routes/products.js');
var cart = require('./routes/cart.js');
var users = require('./routes/user.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategory = require('./routes/admin_categories.js');
var adminProduct = require('./routes/admin_products.js');


app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategory);
app.use('/admin/products', adminProduct);
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);
app.use('/', pages);
var port = 3000;
app.listen(port, function () {
  console.log('Server started on port ' + port);
});