var express = require('express');
var router = express.Router();
var path = require('path');
var items = require('../models/items');
var boys = require('../models/boys');
var multer=require('multer');
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
  res.render('admin/index', { title: 'Slug' });
});
router.get('/main', function(req, res, next) {
    res.render('admin/main', { title: 'Slug' });
});
router.get('/cartedit', function(req, res, next) {
    res.render('admin/edit', { title: 'Slug' });
});

router.post('/up',upload.any(),function (req,res,next) {
new items({
    img : req.files[0].filename,
    Name : req.body.name,
    price:req.body.price,
    Tax:req.body.tax,
    content:req.body.content,
    category:req.body.cat,
    availbility:req.body.ava

    }).save(function (err,suc){

if(err)
{

    res.render("admin/edit",{mes:"Update failed"});
}
else
{
    res.render("admin/edit",{mes:"sucsessfull inserted"})}
    });

});
router.get('/itemedit', function(req, res, next) {
    items.find(function(err,docs){

        res.render('admin/edititem', { title: 'Slug' ,doc: docs});
        console.log(docs);
    });


});

router.get('/delete/:id', function(req, res, next) {
    items.remove({_id:req.params.id},function (err,suc) {
        if(err){

        }
        else {
            res.redirect('/itemedit');
        }
    })

});
router.post('/update', function(req, res, next) {
console.log("hii"+req.body[0].price);
            res.redirect('/itemedit');


});
router.get('/dboys',function (req,res,next) {
    new boys({
        Name: req.body.name,
        Username:req.body.username,
        PhoneNo:req.body.phoneno,
        Email:req.body.email,
        Defaultpassword:req.body.password,
        VechileNumber:req.body.Vno,

}).save(function (err,suc){

        if(err)
        {

            res.render("admin/dboys",{mes:"Update failed"});
        }
        else
        {
            res.render("admin/dboys",{mes:"sucsessfull inserted"})}
    });

});

module.exports = router;
