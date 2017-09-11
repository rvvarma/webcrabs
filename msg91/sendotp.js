const SendOtp = require('sendotp');
const sendOtp = new SendOtp('173983AybSxWrTwD59b4f178');
exports.send = function(phone) {
  console.log("im in otp"+phone);
  sendOtp.send(phone, "PRIIND", function (error, data, response) {
    console.log(data);
    return data;
  });

};

exports.send = function(phone,otp) {

sendOtp.verify(phone, otp, function (error, data, response) {
  console.log(data); // data object with keys 'message' and 'type'
  return data;
  //if(data.type == 'success') console.log('OTP verified successfully')
//  if(data.type == 'error') console.log('OTP verification failed')
});

};
