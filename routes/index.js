
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var items = require('../models/items');
var SENDOTP = require('../msg91/sendotp');
var VERIFYOTP = require('../msg91/verify');
var User = require('../models/user');
var boys = require('../models/boys');
var multer=require('multer');
var jwt    = require('jsonwebtoken');
var mongoose=require('mongoose')
var connection = mongoose.connection;

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

router.get('/resendotp', function(req, res, next) {

  next();
//  res.render('admin/registered', { title: 'Slug',head :false,show:false,check:false });
});
router.post('/getDetails', function(req, res, next) {
  items.findOne({'phonenumber':req.body.phone_number},function(err,docs){
if(docs){
  var k='91'+req.body.phone_number;
  console.log(k);
var re=SENDOTP.send(k);
res.cookie('id', docs._id);
res.cookie('phone', k);

      res.render('admin/registered', {title:'Slug',doc:docs,head:false,show:true,check:false});

    }
    else{


res.render('admin/registered', {title:'Slug',doc:docs,head:false,show:false,check:true});

    }

    //  console.log(docs);
 });

});



router.post('/appointment', function(req, res, next) {
  var id=req.cookies.id;
var phone=req.cookies.phone;
  //var datacheck=VERIFYOTP.verify(phone,req.body.OTP)

  var options = {
        url: "http://api.msg91.com/api/verifyRequestOTP.php?authkey=173983AybSxWrTwD59b4f178&mobile="+phone+"&otp="+req.body.OTP

    }
console.log(options);

    request.get(options, function(error, response, body) {
        res.set('Content-Type', 'Application/json');
        if (!error && response.statusCode == 200) {
          res.set({"Content-Type": "text/html"});
           var re=JSON.parse(body);
          var f=re.type;
          console.log("hii"+f);
if(f=="success")
{
  items.update({_id: id},  {booked:"yes",visitdate: req.body.date}, {w:1}, function(err) {
      if(err){
        throw err;
        res.send("hi");
      }
          else{
      res.clearCookie("id");
        res.clearCookie("phone");

  res.render('admin/registered', { title: 'Slug',head :false,msg:"successfully submited your request",show:true });
}
});


}


else{

  items.findOne({'phonenumber':phone},function(err,docs){
  if(docs){
  res.render('admin/registered', { title: 'Slug',head :false,msg:"Invalid OTP try again",show:true,doc:docs });
}
else{

    res.render('admin/registered', { title: 'Slug',head :false,msg:"Invalid OTP try again",show:true});
}
});
}





  //  res.status(response.statusCode).send(body);
        } else {
          //log.error({respose:body},response.statusCode);
    console.log("noo"+body);

        }
    });


  //console.log('entry updated '+datacheck);
  items.update({_id: id},  {booked:"yes",visitdate: req.body.date}, {w:1}, function(err) {
  if(err){
    throw err;
  }
      else{
    //  console.log('entry updated '+datacheck);


  res.clearCookie("id");
    res.clearCookie("phone");

//res.render('admin/visitorform', { title: 'Slug',head :true });
  }
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
booked:"no",
visitdate:"no",
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




router.get('/employee', function(req, res, next) {
  boys.find({},function(err,docs){
    if(err)
    console.log(err);


      res.render('admin/employee', { title: 'Slug',head :true,doc:docs });
  })

});



router.get('/employee/delete/:id', function(req, res, next) {
  console.log(req.params.id);
  boys.remove({"_id":req.params.id},function(err,docs){
    if(err)
    console.log(err);

console.log("checkk"+docs)
      res.redirect('/employee');
  })

});



router.post('/saveemployee', function(req, res, next) {

  new boys({
    Adhaar:req.body.adhaar,
    Name:req.body.name,
    join:req.body.date,
	username:req.body.username,
	pass:req.body.pass,
    Phone:req.body.phone


  }).save(function (err,suc){

if(err)
{
  boys.find({},function(err,docs){
    if(err)
    console.log(err);
  res.render("admin/employee",{mes:"Update failed",doc:docs,head :true});
})}
else
{
  boys.find({},function(err,docs){
    if(err)
    console.log(err);
  res.render("admin/employee",{mes:"sucsessfull inserted",doc:docs,head :true});
})


}
  });

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
//client detilas of registered

router.get('/clientdetials', function(req, res, next) {

  connection.db.collection("clients", function(err, collection){
          collection.find({}).toArray(function(err, data){
              var docs=JSON.stringify(data.requestBody); // it will print your collection data
//console.log(data.requestBody);
      res.render('admin/client', { title: 'Slug',doc:data ,head :true});
          })
      });

});
router.get('/farmer/:id', function(req, res, next) {
var id=req.params.id;
  connection.db.collection("clients", function(err, collection){
          collection.find({'_id':id}).toArray(function(err, data){
              var docs=JSON.stringify(data.requestBody); // it will print your collection data
//console.log(data.requestBody);



      res.render('admin/farmer', { title: 'Slug',doc:data ,head :true});
          })
      });

    //  console.log(docs);


});









module.exports = router;
