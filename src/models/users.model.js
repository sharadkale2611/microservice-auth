import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mobileNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Assuming a 10-digit mobile number; adjust as needed
                return /^[0-9]{10}$/.test(value);
            },
            message: 'Mobile number must be a 10-digit numeric value',
        },
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    avatar: {
        type: String,
    },
    refreshToken:{
        type:String
    }

}, { timestamps: true })

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()    
})

userSchema.methods.isPasswordCorrect = async function(password){
    
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){

    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)