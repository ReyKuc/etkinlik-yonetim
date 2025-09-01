
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required: true,
    },
    role:{
        type: String,
        enum: ["admin","user"],
    },
});

module.exports = mongoose.model("User",userSchema);