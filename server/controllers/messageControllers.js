const agentModle = require("../model/agentModel");
const conversationModel = require("../model/conversationModel");
const messageModel=require('../model/messageModel')
const path=require('path')

const sendMessage=async(req,res)=>{
    try{
        const senderId=req._id;
        const receiverId=req.params.id;
        // console.log(req?.files?.audio[0]?.filename)
        const imagename=req?.files?.image?req?.files?.image[0]?.filename:null
        // console.log(imagename)
        const audioname=req?.files?.audio?req?.files?.audio[0]?.filename:null
        // console.log(imagename)
        // console.log(audioname)
        const message=req.body.message && req.body.message===""?null:req.body.message;
        // console.log("message:",message)

        if(!senderId ){
            return res.status(400).json({error:"u are not a valid user"})
        }
        // console.log(message)
        if( !receiverId ){
            return res.status(400).json({error:"receiverID is required"})
        }

        if(!message && !imagename && !audioname){
            return res.status(400).json({error:"send something"})
        }

        if(imagename && !imagename.includes('.jpg') && !imagename.includes('.png')){
            return res.status(400).json({error:"only jpg/png files are allowed"})
        }
      

       let existConversation = await conversationModel.findOne( 
            {
                participants:{$all:[senderId,receiverId]}
            }
        )
        

        if(!existConversation){
             existConversation=await conversationModel.create(
                {participants:[senderId,receiverId]}
             )
        }
        // console.log("existConversation",existConversation._id)
      
        //message check
        if(!imagename && !audioname && message){
            const newMessage=await messageModel.create({convoId:existConversation._id,senderId,receiverId,message})
            // console.log(newMessage)

            if(newMessage){
                existConversation.messages.push(newMessage)
            }

            await existConversation.save()
            return res.status(200).json({messge:"message send successfully",convo:newMessage})
        }

    
        //all fields
        const newMessage=await messageModel.create({convoId:existConversation._id,senderId,receiverId,message,imagename,audioname})
         // console.log(newMessage)
        if(newMessage){
             existConversation.messages.push(newMessage)
        }

            await existConversation.save()
            return res.status(200).json({messge:"message send successfully",convo:newMessage})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"internal server error at sender message api"})
    }
}


const receiveMessage = async(req,res)=>{
    try{
        const senderId=req.params.id;
        const receiverId=req._id;

        const conversation = await conversationModel.findOne({
            participants:{$all:[receiverId,senderId]}
        }).populate("messages")
        // console.log(conversation?._id)

        if(!conversation){
            return res.status(200).json([])
        }  


        // const isReadUpdate = await messageModel.updateMany({convoId:conversation?._id,receiverId:req._id},{$set:{isRead:true}})

        // console.log("isReadUpdate",isReadUpdate)
        
        return res.status(200).json(conversation.messages)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"internal server error at receive message api"})
    }
}

const chatUser=async(req,res)=>{
    try{
        const id=req._id;
        const chatUser=await agentModle.find(
            {_id:{$ne:id}}
        ).select("-password").select('-email')
        // console.log(chatUser)
        return res.status(200).json(chatUser)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"internal server error at chatUser api"})
    }
}


const showImage=async(req,res)=>{
    try{
        const imagename=req.params.name;
     
        const getdirpath=path.join(process.cwd(),'imageUploads')
        const getimagefullPath=`${getdirpath}/${imagename}`
        
        return res.sendFile(getimagefullPath)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"internal server error at showImage api"})
    }
}

const getAudio = async(req,res)=>{
    try{

        const audioname = req.params.audio;
        
        const getdirpath = path.join(process.cwd(),"imageUploads")
        const getfilePath = `${getdirpath}/${audioname}`

        return res.sendFile(getfilePath)
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error:"internal server error at getAudio api"})
    }
}



const deleteMessage = async(req,res)=>{
    try{
        const id= req.params.id;
        console.log(id)
        await messageModel.findByIdAndDelete(id)
        return res.status(200).json({message:"message deleted"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error at deleteMessage api"})
    }
}


const updateMessage = async(req,res)=>{
    try{
        const id = req.params.id;
        const ud=req.body;
        await messageModel.findByIdAndUpdate(id,ud)
        return res.status(200).json({message:"message updated successfully"})
        
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error at updateMessage api"})
    }
}


const isReadUpdate = async(req,res)=>{   
    try{
        const {convoId,senderId}=req.params;
        const isREAD = await messageModel.findByIdAndUpdate({convoId})
    }
    catch(err){
        console.log(err)
    }
}

const unReadCount = async(req,res)=>{
    try{
        const {userId} = req.params;
        const IsReadCount = await messageModel.find({receiverId:userId,isRead:false})
        // console.log("IsReadCount ",IsReadCount )

        var readcount = 0;
        if(!IsReadCount){
            return res.status(200).json(readcount)
        }

        IsReadCount.map((item)=>{
              readcount+=1
              console.log('readcount',readcount)
        })
        // console.log(readcount)
        return res.status(200).json(readcount)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"internal server error"})
    }
}



module.exports={sendMessage,receiveMessage,chatUser,showImage,getAudio,deleteMessage,updateMessage,unReadCount}