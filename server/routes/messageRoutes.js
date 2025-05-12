const express=require('express');
const r=express.Router();
const multer=require('multer')

const {sendMessage,receiveMessage,chatUser,showImage,getAudio,deleteMessage,updateMessage,unReadCount}  = require('../controllers/messageControllers')
const authMid=require('../middleware/authMiddleware')

const storage = multer.diskStorage({
    fileFilter:function(req,file,cb){
      if(file.mimetype==='image/png' || file.mimetype==='image/jpg'){
          cb(null,true)
      }
      else{
        cb(new Error('this type of file is not allowed'),false)
      }
    },
    destination: function (req, file, cb) {
      cb(null, './imageUploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,  '-' + uniqueSuffix+file.originalname )
    }
  })
  
  const upload = multer({ storage: storage })

r.post('/sendmessage/:id',authMid,upload.fields([{ name: "audio" },{ name: "image" }]),sendMessage)
r.get('/receivemessage/:id',authMid,receiveMessage )
r.get('/getChatUserData',authMid,chatUser)
r.get('/showimage/:name',authMid,showImage)
r.get('/getaudio/:audio',authMid,getAudio)
r.get('/getreadcount/:userId',unReadCount)
r.delete('/messagedelete/:id',authMid,deleteMessage)
r.put('/updatemessage/:id',authMid,updateMessage)
module.exports=r