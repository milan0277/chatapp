const agentModel=require("../model/agentModel")
const fileModel=require("../model/fileModel")
const bcrypt=require('bcryptjs')
const genToken = require("../jwt/Token");
const multer=require('multer')
const fs=require('fs')
const csv = require("csv-parser");




const Login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        // console.log(email,password)
        if(!email || !password){
            return res.status(400).json({error:"all fields are required"})
        }
        // console.log(email,password)

        const existUser=await agentModel.findOne({email});
        if(!existUser){
            return res.status(400).json({message:"agent doesn't exist"})
        }
        // console.log('email found',existUser)

        const Password=await bcrypt.compare(password,existUser.password)
        // console.log(password)
        // console.log(existUser.password)
        // console.log(Password)
        if(!Password){
            return res.status(400).json({message:"invalid password"})
        }

        if(existUser.designation==="admin"){
            // console.log(existUser._id)
            genToken(res,existUser._id)
           
            return res.status(200).json({message:"admin login succesfull",existUser})
        }

        genToken(res,existUser._id)
        return res.status(200).json({message:"agent login succesfull",existUser})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error"})
    }
}

const logout=(req,res)=>{
    try{
        const cookie = req.cookies.jwt;

        return res.status(200).clearCookie("jwt").json({message:"logout successfull"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error"})
    }
}

const agentC=async(req,res)=>{
    try{

        const Id=req._id;
        const checkAdmin=await agentModel.findOne({_id:Id})
        // console.log(checkAdmin)
        if(checkAdmin.designation!=="admin"){
            return res.status(400).json({message:"only admins can create agents"})
        }

        const {name,email,city,password,designation}=req.body;
        // console.log(city)
        if(!name || !email || !password || !designation || !city){
            return res.status(400).json({message:"All fields are required"})
        }

        const existUser=await agentModel.findOne({email})
        if(existUser){
            return res.status(400).json({message:"agent exist"})
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        if(!hashedPassword){
            return res.status(400).json({message:"password is not hashed"})
        }

        const newDoc=new agentModel({name,email,password:hashedPassword,designation,city})
        const newagent=await newDoc.save()

        return res.status(201).json({message:"created successfully",newagent})



    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error"})
    }
}


const getAllAgents =async(req,res)=>{
    try{
        const Id=req._id;
        // console.log(Id)
        const checkAdmin=await agentModel.findOne({_id:Id})
        // console.log(checkAdmin)
        if(checkAdmin.designation!=="admin"){
            return res.status(400).json({message:"you are not a agent"})
        }
        const getAllAgentsData=await agentModel.find(
           
            // {
            //     designation : {$ne : "admin"}
            // }
        ).select("-password")
        // console.log(getAllAgentsData)
        return res.status(200).json(getAllAgentsData)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error"})
    }
}

const delteData=async(req,res)=>{
    try{
        const Id=req._id;
        // console.log(Id)
        const checkAdmin=await agentModel.findOne({_id:Id}).select("-password")
        // console.log(checkAdmin)
        if(checkAdmin.designation!=="admin"){
            return res.status(400).json({message:"you are not a admin"})
        }
        const id=req.params.id;
        // console.log(id)
        const checkesistagent=await agentModel.findOne({_id:id})
        if(!checkesistagent){
            return res.status(400).json({message:"agent deoesn't exist"})
        }
        const ddata=await agentModel.findByIdAndDelete(id)
        return res.status(200).json({message:"deleted successfull",ddata})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error"})
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    },
  })


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['text/csv'];
  
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('Only CSV files are allowed!'), false); 
    }
  };
  
 
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  })



const createFile = async (req, res) => {
    
      try {
       
        let count = 0; 
        let fileDuplicates = 0; 
        let emailSet = new Set();
        let promises = [];
  
        console.log("Processing file:", req.file.originalname);
  
        const stream = fs.createReadStream(req.file.path)
          .pipe(csv({ mapHeaders: ({ header }) => header.toLowerCase().replace(/\s+/g, "") }));
  
        for await (const row of stream) {
          if (!row.email) {
            continue;
          }
  
          if (emailSet.has(row.email)) {
            fileDuplicates += 1;
            continue;
          }
          emailSet.add(row.email);
  
          const processRow = async () => {
            try {
              const checkEmail = await agentModel.findOne({ email: row.email });
              if (checkEmail) {
                count += 1;
              } else {
                const { designation, name, email, password,city } = row;

                if (!designation || !name || !email || !password || !city ) return;
                const newCity=city.split(",")
  
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
  
                const newAgent = new agentModel({ designation:designation.toLowerCase(), name, email,city:newCity, password: hashedPassword });
                await newAgent.save();
              }
            } catch (error) {
              console.error("Error processing row:", error);
              throw error;
            }
          };
  
          promises.push(processRow());
        }
  
        await Promise.all(promises);

        
        console.log("CSV file successfully processed");
  
        
        return res.status(200).json({
          success: true,
          message: "Successfully uploaded",
          duplicateInFileCount: fileDuplicates,
          duplicateInDBCount: count,
        });
  
      } catch (error) {
        console.error("Error handling file upload:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
      }
 
  };

const readFile=async(req,res)=>{
    try{
        const Id=req._id;
        if(!Id){
            return res.status(200).json({message:"u are not authenticated"})
        }

        const csvFileData=await fileModel.find();

        return res.status(200).json(csvFileData)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error: "File read failed" });
    }
}

const updateagent=async(req,res)=>{
    try{
        const {name,email,city,password}=req.body;
        console.log(city)
        const id=req.params.id;
        const existUser=await agentModel.findOne({_id:id})
        // console.log("existUser",existUser._id)


        if(!existUser){
            return res.status(400).json({error:"user doesn't exist"})
        }

        const checkEmail = await agentModel.findOne({email:email})
        // console.log("checkEmail",checkEmail._id)
        if( checkEmail &&  id!=checkEmail?._id ){
            // console.log("work")
            return res.status(400).json({error:"email should be unique to every agent"})
        }

        if(!password){
           
            const updateddata=await agentModel.findByIdAndUpdate(id,{name,email,city,password:existUser.password})
            const data=await agentModel.findById({_id:updateddata._id})
            return res.status(201).json({message:"update successfull",data})
        }
        else{
            
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt)
            const updateddata=await agentModel.findByIdAndUpdate(id,{name,email,city,password:hashedPassword},{ new: true })
            const data=await agentModel.findById({_id:updateddata._id})
            return res.status(201).json({message:"update successfull",data})
        } 
    }
    catch(err){
        // console.log(err)
        res.status(500).json({ error: "internal server error at update" });
    }
}


const getSpecificAgent = async(req,res)=>{
    try{
        const id = req._id;
        const user = await agentModel.findOne({_id:id})
        return res.status(200).json(user)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ error: "internal server error at getSpecific agent" });
    }
}

const specificAgentUpdate = async(req,res)=>{
    try{
        const {name,email,city,password}=req.body;
        const id=req._id;
        console.log(city)

        const existUser=await agentModel.findOne({_id:id})
        // console.log("existUser",existUser._id)


        if(!existUser){
            return res.status(400).json({error:"user doesn't exist"})
        }

        const checkEmail = await agentModel.findOne({email:email})
        // console.log("checkEmail",checkEmail._id)
        if( checkEmail &&  id!=checkEmail?._id ){
            // console.log("work")
            return res.status(400).json({error:"email should be unique to every agent"})
        }

        if(!password){ 
            const updateddata=await agentModel.findByIdAndUpdate(id,{name,email,city,password:existUser.password})
            const data=await agentModel.findById({_id:updateddata._id})
            return res.status(201).json({message:"Profile updated",data})
        }
        else{
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt)
            const updateddata=await agentModel.findByIdAndUpdate(id,{name,email,city,password:hashedPassword},{ new: true })
            const data=await agentModel.findById({_id:updateddata._id})
            return res.status(201).json({message:"Profile updated",data})
        } 

    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error"})
    }
}



module.exports={agentC,Login,logout,getAllAgents,delteData,createFile,updateagent,upload,readFile,getSpecificAgent,specificAgentUpdate}