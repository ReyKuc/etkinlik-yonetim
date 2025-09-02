
const express =require("express")
const router = express.Router()
const User = require("../models/User")

router.get("/",async (req,res)=>{
    try{
        const users = await User.find().select("-password")
        res.json(users)
    }catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.get("/:id",async (req,res)=>{
    try{
        const user = await User.findById(req.params.id).select("-password")
        if(!user) return res.status(404).json({message:"User Not Found"})
            res.json(user)

    }catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
})

module.exports = router