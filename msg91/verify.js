const SendOtp = require('sendotp');
const sendOtp = new SendOtp('173983AybSxWrTwD59b4f178');
exports.verify = function(phone,otp) {

sendOtp.verify(phone, otp, function (error, data, response) {
  console.log(phone+" "+otp+" "+response); // data object with keys 'message' and 'type'
  return data;
  if(data.type == 'success') console.log('OTP verified successfully')
 if(data.type == 'error') console.log('OTP verification failed')
});

};
