
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.register = async(req,res)=>{
    try{
        const {username,password,role}= req.body;
        if(!username || !password || !role){
            return res.status(400).json({message:"Please provide username,password and role"});
        }
        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({message:"Username already exist"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({username,password:hashedPassword,role})

        await user.save()

        res.status(201).json({message:"User registered"});
    }catch(error){
        res.status(500).json({message:"Server Error",error})
    }
};


exports.login = async(req,res)=>{
    try{
        const {username,password}=req.body

        if(!username || !password){
            return res.status(400).json({message:"Please provide username and password"})
        }
        const user = await User.findOne({username})
        if(!user){
            return res.status(401).json({message:"Invalid credential"})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credential"})
        }
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{
            expiresIn:"1d",
        })
        res.json({token});
    }catch(error){
        res.status(500).json({message:"Server Error",error})

    }
}

exports.getProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password")
        if(!user) return res.status(404).json({message:"User Not Found"})

            res.json(user)
    }catch(error){
        res.status(500).json({message:"Server Error",error})
    }
};