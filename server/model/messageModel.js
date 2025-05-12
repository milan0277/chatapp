const mongoose=require('mongoose');
const agentModel=require('./agentModel')

const messageSchema = new mongoose.Schema({
    convoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"conversationM",
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"agentM",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"agentM",
        required:true
    },
    message:{
        type:String
    },
    imagename:{
        type:String
    },
    audioname:{
        type:String
    },
    isRead:{
        type:Boolean,
        default:false
    }          
},{timestamps:true})

const messageModel=mongoose.model('messageModel',messageSchema)
module.exports=messageModel