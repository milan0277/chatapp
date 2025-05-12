const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postId:{
        type:String,
        trim:true
    },
    postText:{
        type:String,
        trim:true
    },
    createdbyid:{
        type:String,
        trim:true
    },
    createdbyusername:{
        type:String,
        trim:true
    },
    attachment:{
        type:String,
        trim:true
    },
    comments:[
         {
            commentId:{
                type:String,
                trim:true
            },
            comment:{
                type:String,
                trim:true
            },
            createdbyid: {
                type: String,
                trim: true,
            },
            createdbyusername: {
                type: String,
                trim: true,
            },
            createdTime:{
                type:String,
            }
         }
    ]
,
approval:{
    type:String,
    trim:true
},
approvedBy:{
    type:String,
    trim:true
},
approvedDate:{
    type:Date
}


},{timestamps:true})

const postModel = mongoose.model("postModel",postSchema)

module.exports=postModel