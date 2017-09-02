/**
 * Created by Nani on 7/8/2017.
 */
var mon=require('mongoose');
//var Schema=mon.Schema;
var scheme=new mon.Schema({
    img:{type:String,required:true},
    Name:{type:String,required:true},
    price:{type:String,required:true},
    Tax:{type:String,required:true},
    content:{type:String,required:true},
    category:{type:String,required:true},
    availbility:{type:String,required:true}


});
module.exports=mon.model('items',scheme)