var mongoose=require('mongoose');
var Schema= mongoose.Schema;
var User=require('./user')
var commentSchema=new Schema({
    body:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

module.exports=mongoose.model('Comment',commentSchema)