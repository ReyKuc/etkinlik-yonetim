


const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum: ["planned","ongoing","completed"],
        default:"planned",
    },
},
{ timestamps: true }
)

module.exports = mongoose.model("Attendance", attendanceSchema)