import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import ApiResponse  from "../utils/ApiResponse.js";

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


    const avtarLocalpath = req.files?.avtar[0].path;
    const coverImageLocalpath = req.files?.coverImage[0].path;

    if(!avtarLocalpath){
        throw new ApiError(400,"Avtar file is required")
    }
    
    const avtar = await uploadOnCloudinary(avtarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)
    
    if(!avtar ){
        throw new ApiError(400,"Avtar file is required")
    }

    const user = await User.create({
        fullName,
        avtar : avtar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        userName: userName.toLowercase()
    })

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createduser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }
    return res.status(201).json(
        new ApiResponse(200,createduser,"user registered successFlly")
    )
})


export default userregister