import { Schema } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new Schema(
    {
        userName:{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            index : true,
            trim : true
        },
        email:{
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        fullName:{
            type : String,
            required : true,
            trim : true,
            index : true,
        },
        avatar:{
            type : String,
            required : true,
        },
        coverImage:{
            type : String,
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video",
            }
        ],
        password :{
            type : String,
            required : [
                true , "password is required"
            ]
        },
        refreshToken : {
            type : String,
        }
    },
    {
        timestamps : true,
    }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
})
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            userName : this.userName,
            email : this.email,
            fullName : this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generaterefreshToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            
        },
        process.env.REFERESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFERESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
