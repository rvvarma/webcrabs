var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('173983AybSxWrTwD59b4f178');

router.get('/send', function(req, res, next) {
/*  request('https://control.msg91.com/api/sendotp.php?authkey=173983AybSxWrTwD59b4f178&mobile=8522880026&message=Your%20otp%20is%202786&sender=Raghav', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    res.send(body);
  });*/





  sendOtp.send("918522880026", "PRIIND", function (error, data, response) {
    console.log(data);
    res.send(response);
  });
});
module.exports = router;
