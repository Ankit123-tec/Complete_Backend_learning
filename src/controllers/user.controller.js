import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const userregister = asyncHandler(async (req, res) => {
    // res.status(500).json({
    //     message : "Internal server Error"
    // }) 


    const {fullName ,email, userName , password } = req.body
    console.log("email:",email);
    console.log("userName ", userName);

    // validation check 

    if(
        [fullName ,email, userName , password].some((field)=> 
            field?.trim() === "")
    ){
        throw new ApiError("The Api is not found");
    }

    const existedUser = User.findOne({
        $or : [{userName},{email}]
    })

    if(existedUser){
        throw new ApiError("user is already existed please give another email and username");
    }
})


export default userregister