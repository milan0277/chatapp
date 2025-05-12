const postM = require('../model/posts')
const multer = require("multer")
const fileUrl = 'http://localhost:5000/imageUploads/'
const fbUrl = process.env.FB_URL
const fb_Access_token = process.env.FB_ACCESS_TOKEN
const fb_pageId = process.env.FBPAGE_ID
const axios = require('axios')
const path = require("path")
const FormData = require('form-data')
const fs=require("fs")



const createPost = async(req, res) => {
    try {
        const {id,ptext,authUser} = req.body;
        // console.log("createPost api data : ", data)
        console.log("auth user :",authUser)

        if(!id || !ptext || !authUser){
            return res.status(400).json({message:"pass all information"})
        }

        const data  = {
            postId:id,
            postText:ptext,
            createdbyid:authUser?._id,
            createdbyusername:authUser?.name,
            source: 'Facebook',
            approval: authUser?.designation==="admin" ? "Accepted" : "Pending",
            approvedBy: authUser?.designation==="admin" ?  authUser?._id : null,
            approvedDate: authUser?.designation==="admin" ? new Date() : null
        }

        const savePost = new postM(data)
        const post = await savePost.save()
        console.log("saved post : ",post)

        res.status(200).json({message:"post saved successfully"})
    }
    catch (err) {
        console.log("error in createPost api", err)
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './imageUploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
const upload = multer({ storage: storage })

async function sendPostUploads(text, attachment) {
    try {
        const getDirPath = path.join(process.cwd(), 'imageUploads');
        const filePath = path.join(getDirPath, attachment);
        console.log("Uploading attachment:", filePath);

        const form = new FormData();
        form.append('caption', text);
        form.append('access_token', fb_Access_token);
        form.append('source', fs.createReadStream(filePath));

        const response = await axios.post(
            `https://graph.facebook.com/${fb_pageId}/photos`,
            form,
            {
                headers: {
                    ...form.getHeaders()
                }
            }
        );

        console.log('Upload Success:', response.data);
    } catch (err) {
        console.error(" Error in sendPostUploads:", err.response?.data || err.message);
    }
}

const newUploads = async(req,res)=>{
    try{

        const data = req?.body?req?.body:""
        let attachment = req.file ? req.file.filename : null
        console.log(attachment)
        const user = JSON.parse(data?.authUser) 
        // console.log("data :",data)
        // console.log("auth user : ",user)
        const post = data?.postText || '';
        // Create new post object
        const newPost = {
            post: post,
            createdBy: user?.name,
            createdById: user?._id,
            source : 'Facebook',
            attachment: attachment, // Save file name if uploaded
            approval: user?.designation === "admin" ? "Accepted" : "Pending",
            approvedBy: user?.designation === "admin"  ? user?._id : null,
            approvedDate: user?.designation === "admin"  ? new Date() : null
        };

        const result = await postM.create(newPost)
        user?.designation==="admin"?sendPostUploads(post,attachment):null
        console.log("newUplaods data :",newPost)
        res.status(200).json({message:"attachment upload successfull"})

    }
    catch(err){
        console.log("error at newUploads api :",err)
        res.status(500).json({error:"internal server error"})
    }
}



module.exports = { createPost,upload,newUploads }