/**
 * Created by Nani on 7/8/2017.
 */
var mon=require('mongoose');
//var Schema=mon.Schema;
var scheme=new mon.Schema({
    adhaarcard:{type:String,required:true},
    photocard:{type:String,required:true},
    addresscard:{type:String,required:true},
    adhaar:{type:String,required:true},
  person:{type:String,required:true},
    date:{type:String,required:true},
    address:{type:String,required:true},
    phonenumber:{type:String,required:true},
    email:{type:String,required:true},
    pan:{type:String,required:true},
    occupation:{type:String,required:true},
    visitpurpose:{type:String,required:true},
    timestamp:{ type : Date,required:true}



});
module.exports=mon.model('multiitems',scheme)
