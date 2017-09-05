var express = require('express');
var router = express.Router();
var path = require('path');
var items = require('../models/items');
var User = require('../models/user');
var boys = require('../models/boys');
var multer=require('multer');
var jwt    = require('jsonwebtoken');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploaded')
    },
    filename: function (req, file, cb) {
        cb(null,Date.now()+'-'+file.originalname); // modified here  or user file.mimetype
    }
})

var upload=multer({storage :storage});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index', { title: 'Slug',head :false });
});
router.get('/visitorform', function(req, res, next) {
  res.render('admin/visitorform', { title: 'Slug',head :false });
});
router.get('/registered', function(req, res, next) {
  res.render('admin/registered', { title: 'Slug',head :false,show:false,check:false });
});
router.post('/getDetails', function(req, res, next) {
  items.findOne({'phonenumber':req.body.phone_number},function(err,docs){
if(docs){
      res.render('admin/registered', {title:'Slug',doc:docs,head:false,show:true,check:false});
    }
    else{
res.render('admin/registered', {title:'Slug',doc:docs,head:false,show:false,check:true});

    }

    //  console.log(docs);
 });

});



router.get('/set', function(req, res, next) {
  var nick = new User({
     name: 'Cerminara',
     password: 'password',
     admin: true
   });

   // save the sample user
   nick.save(function(err) {
     if (err) throw err;

     console.log('User saved successfully');
     res.json({ success: true });
   });
});



router.post('/auth', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
    //  res.json({ success: false, message: 'Authentication failed. User not found.' });
  res.render('admin/index',{head :false,success: true,message :"User not found"});
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
      //  res.json({ success: false, message: 'Authentication failed. Wrong password.' });
  res.render('admin/index',{head :false,success: true,message :"Invalid password"});
      } else {


        var token = jwt.sign(user, 'scotch', {


          expiresIn: 3600 // expires in 24 hours
        });

        // return the information including token as JSON

          res.cookie('token', token);
          res.render('admin/main',{head :true,success: true})
        /*res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });*/
      }

    }

  });
});

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'scotch', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    res.render('admin/index',{head:false});

  }
});

router.get('/logout', function(req, res, next) {
  res.clearCookie("token");
  res.render('admin/index', { title: 'Slug',head :false });
});



router.get('/main', function(req, res, next) {
    res.render('admin/main', { title: 'Slug',head :true });
});

router.get('/list', function(req, res, next) {
items.find({},null,{sort:{timestamp: 1}},function(err,docs){
  if(err)
  console.log(err);


    res.render('admin/listview.hbs', { title: 'Slug' ,doc:docs,head :true});
})
});


router.get('/viewprofile/:id', function(req, res, next) {
  var a=req.params.id;
  items.findOne({'_id':a},function(err,docs){

      res.render('admin/profile', { title: 'Slug',doc:docs ,head :true});
    //  console.log(docs);
 });

});


router.post('/up',upload.any(),function (req,res,next) {
new items({
  adhaarcard : req.files[0].filename,
photocard: req.files[1].filename,
addresscard : req.files[2].filename,
adhaar:req.body.adhaar_number,
person:req.body.name,
date:req.body.date,
address:req.body.Address,
phonenumber:req.body.phone_number,
email:req.body.email,
pan:req.body.pan_nummber,
occupation:req.body.occupation,
visitpurpose:req.body.purpose_of_vist,
timestamp: new Date()

    }).save(function (err,suc){

if(err)
{

    res.render("admin/visitorform",{mes:"Update failed"});
}
else
{
    res.render("admin/visitorform",{mes:"sucsessfull inserted"})}
    });

});





module.exports = router;
