
const Joi = require("joi");

const userschema= Joi.object({
    name:Joistring().min(3).max(30).required().messages({
        "string.base":"Name must be a string",
        "string.empt":"Name cannot be empty",
        "string.min":"Name must be at least 3 characters long",
        "any.required":"Name is required",
    }),
    
    email: Joi.string().email().required().messages({
        "string.email":"Email must be valid",
        "any.required":"Email is required",
    }),

    password: Joi.string().min(6).required().messages({
        "string.min":"Password must be at least 6 characters long",
        "any.required":"Password is required",
    }),

});

const validateUser = (req,res,next)=>{
    const{error} = userschema.validate(req.body, {abortEarly: false})
    if(error){
        return res.status(400).json({
            message:"Validation error",
            details: error.details.map((err) =>err.message),
        });
    }

    next();
}

module.exports = validateUser