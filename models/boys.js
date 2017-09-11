var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('employee', new Schema({
    Name:{type:String,required:true},
    Phone:{type:String,required:true},
    Adhaar:{type:String,required:true},
    join:{type:String,required:true},
    type:{type:String,required:true}
}));
