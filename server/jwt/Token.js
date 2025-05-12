const jwt=require('jsonwebtoken')


require('dotenv').config()
// console.log(process.env.SECERET_KEY)


const genToken=async(res,id)=>{
    try{
        const token = jwt.sign({id},process.env.SECERET_KEY,{expiresIn:"7d"})

        return res.cookie("jwt",token,{ maxAge: 24 * 60 * 60 * 1000, httpOnly: false })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error"})
    }

}

module.exports=genToken