const SendOtp = require('sendotp');
const sendOtp = new SendOtp('173983AybSxWrTwD59b4f178');
exports.send = function(phone) {
  console.log("im in otp"+phone);
  sendOtp.send(phone, "PRIIND", function (error, data, response) {
    console.log(data);
    return data;
  });

};
