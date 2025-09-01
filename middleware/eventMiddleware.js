const Event = require("../models/event");

const checkEventOwnership = async(req,res,next)=>{
    try{
        const event = await Event.findById(req.params.id)
        if(!event){
            return res.status(404).json({message:"Event Not Found"})
        }
        if(req.user.role !=="admin" && event.createdBy.toString()!== req.user.id){
            return res.status(403).json({message:"Access Denied"})
        }
        req.event =event;
        next();
    }catch(error){
        res.status(500).json({message:"Server Error",error})
    }
};

module.exports = {checkEventOwnership}