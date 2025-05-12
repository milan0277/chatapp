const express=require('express');
const router=express.Router();

const {agentC,Login,logout,getAllAgents,delteData,createFile,updateagent,upload,readFile,getSpecificAgent,specificAgentUpdate}=require("../controllers/userControllers")
const authmid=require("../middleware/authMiddleware")

router.post("/login",Login)
router.post("/agentc",authmid,agentC)
router.get("/logout",authmid,logout)
router.get("/getagentsdata",authmid,getAllAgents)
router.delete("/deltedata/:id",authmid,delteData)
router.post("/sendfile",authmid, (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("Multer Error:", err.message);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },createFile)
router.put("/update/:id",authmid,updateagent)
router.get("/readfile",authmid,readFile)
router.get('/getUser',authmid,getSpecificAgent)
router.put('/updatespecificagent',authmid,specificAgentUpdate)
// router.post("/")

module.exports=router