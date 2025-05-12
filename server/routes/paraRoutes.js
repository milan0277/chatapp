const express=require('express')
const {addPara ,readPara,updatePara,deletePara}= require('../controllers/parameterController')

const r=express.Router()

r.post('/api/paraadd',addPara)
r.put('/api/updatepara/:id',updatePara)
r.get('/api/readpara',readPara)
r.delete("/api/deletepara/:id",deletePara)
module.exports=r