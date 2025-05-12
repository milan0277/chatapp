const mongoose = require('mongoose')

const paraScheme = new mongoose.Schema({
    records:[{
        name:{
            type: String,
            required: true
        },
        age:{
            type: Number,
            required: true
        },
        fields:[
            {
                state:{
                    type: String,
                    required: true
                }
                ,
                address:{
                    type: String,
                    required: true
                }
            }
        ]
    }]
 
   
},{timestamps:true})

const paraModel = mongoose.model("paraM", paraScheme)
module.exports=paraModel