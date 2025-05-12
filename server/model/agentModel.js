const mongoose=require('mongoose');

const agentSchema=new mongoose.Schema({
    designation:{
        type:String,
        required:true,
        enum:["admin","agent"]
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    city:{
        type:Array,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

const agentModle=mongoose.model("agentM",agentSchema)

module.exports=agentModle