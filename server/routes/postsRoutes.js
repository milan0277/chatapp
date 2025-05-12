const express = require("express");
const r = express.Router()

const {createPost,upload,newUploads} = require('../controllers/fb')

r.post("/fb/api",createPost)
r.post("/fb/api/uploadsPosts",upload.single("image"),newUploads)

module.exports=r