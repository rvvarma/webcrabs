/**
 * Created by Nani on 7/8/2017.
 */
var mon=require('mongoose');
//var Schema=mon.Schema;
var scheme=new mon.Schema({
    Username:{type:String,required:true},
    Name:{type:String,required:true},
    VechileNumber:{type:String,required:true},
    PhoneNo:{type:String,required:true},
DefaultPassword:{type:String,required:true},
Email:{type:String,required:true}


});
module.exports=mon.model('boys',scheme)