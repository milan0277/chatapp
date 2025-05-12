const mongoose =require('mongoose');

const fileSchema=new mongoose.Schema({
    index:{
        type:Number,
        required:true
    },
    customerid:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone1:{
        type:String,
        required:true
    },
    phone2:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    subscriptiondate:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:true
    }
},{timestamps:true})


const fileModel=mongoose.model("file",fileSchema)

module.exports=fileModel