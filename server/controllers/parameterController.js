const { model } = require('mongoose');
const paraM = require('../model/Parameter')


const addPara = async (req, res) => {
    try {
        const data = req.body;
        console.log("add para data",data)

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: "Invalid input. Expected an array of objects." });
        }


        const arr=[]
        data.map(entry => (arr.push({
            name: entry.name,
            age: entry.age,
            fields: entry.fields.map(field => ({
                state: field.state,
                address: field.address
            }))})
            
        ))

        const savedEntry = await paraM({records:arr});

       const savedEntry2 = await savedEntry.save()
        return res.status(201).json({ message: "data saved Successfully", data: savedEntry2 });

    } catch (err) {
        console.error("Error adding data:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


const readPara = async(req,res)=>{
    try{

        const paraData = await paraM.find()
        // console.log(paraData)
        res.status(200).json(paraData)
    }
    catch(err){
        console.log(err)
    }
}

const updatePara = async(req,res)=>{
    try{
        const id = req.params.id;
        const updateData = req.body;

        // console.log(updateData)
        await paraM.findByIdAndUpdate(id,updateData)
        // console.log(update)
        return res.status(200).json({message:"data updated successfully"})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({error:"internal server error"})
    }
}


const deletePara = async(req,res)=>{
    try{
        const {id} = req.params
        // console.log(id)
        const dData = await paraM.findByIdAndDelete(id)
        return res.status(200).json({message:"data deleted successfully"})
    }
    catch(err){
        console.log(err)
    }
}


module.exports={addPara,readPara,updatePara,deletePara}