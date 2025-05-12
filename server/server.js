const express=require('express');
const app=express();
require('dotenv').config()
const bodyParser=require('body-parser')
const cors=require('cors');
const cookieParser = require("cookie-parser")
const { Server } = require("socket.io");
const http=require('http')
const path=require('path')
const getdirpath=path.join(__dirname,"imageUploads");

const server=http.createServer(app)
const io=new Server(server,{
  cors:{
    origin: 'http://localhost:3000', // Without trailing slash
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Include credentials if necessary
  }
})

//parse
app.use(bodyParser.json())
//port
const PORT=process.env.PORT || 5000;
//router
const router=require("./routes/agentRoutes")
const messageRouter=require('./routes/messageRoutes')
const pararouter=require('./routes/paraRoutes')
const postRouter = require('./routes/postsRoutes')

//db  
const db=require("./config/db")
//cookie-parser
app.use(cookieParser())


const corsOptions = {
  origin: 'http://localhost:3000', // Without trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Include credentials if necessary
};
app.use(cors(corsOptions))

const users=new Map()

io.on("connection",(socket)=>{
  console.log('user connected',socket.id)
  // console.log("users at connection created time",users)

  socket.on("register",(userId)=>{

    users.set(userId,socket.id)

  })

  socket.on('message',({m,image,audio,receiverId,senderId})=>{
    // console.log(m,image,audio,receiverId)
    const receiverSocketId=users.get(receiverId)
    // console.log(u)
    
    // console.log("receiverSoketId:",receiverSocketId)
    if(m==="" && !audio){
      if(receiverSocketId){
        // console.log("!m")
        io.to(receiverSocketId).emit("data",{image,senderId})
      }
    }
    else if(m && !image){
      if(receiverSocketId){
        // console.log("!image")
        io.to(receiverSocketId).emit("data",{m,senderId})  
      }
    }
    else if(!m && !image && audio){
      if(receiverSocketId){
        // console.log("!image")
        io.to(receiverSocketId).emit("data",{audio,senderId})
      }
    }
    else{
      if(receiverSocketId){
        // console.log('both')
        io.to(receiverSocketId).emit("data",{m,image,audio,senderId})
      }
    }
   
  })
   

  socket.on("deletemessage",({mId,receiverId})=>{
    console.log("users",users)
    console.log(mId,receiverId)
    let receiverSocektId = users.get(receiverId)
    console.log(receiverSocektId)
    if(receiverSocektId){
      io.to(receiverSocektId).emit("dMessage",mId)
    }
})

  // socket.on('suMessage',({message,room})=>{
  //   console.log(`message:${message},RsocketId:${room}`)
  //   socket.to(room).emit("data",message)
  // })


  // socket.on('rn',(RoomName)=>{
  //   console.log('user joined')
  //   socket.join(RoomName) 
  // })

  socket.on('disconnect',()=>{
    users.forEach((value,key)=>{
      if(value===socket.id){
        users.delete(key)
      }
    })
    console.log('user disconnected',socket.id)
  })

})
// app.use('/imageUploads', express.static(path.join(__dirname, 'imageUploads')));
app.use(express.static(getdirpath))
app.use("/loginsystem/api",router)
app.use("/loginsystem/message/api",messageRouter)
app.use('/loginsystem',pararouter)
app.use('/loginsystem',postRouter)
server.listen(PORT,()=>{
    console.log('server is running at ',PORT)
})