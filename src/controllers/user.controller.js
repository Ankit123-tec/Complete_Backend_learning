import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { access } from "fs";



const generateAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generaterefreshToken()

        user.refreshToken = refreshtoken;
        await user.save({validateBeforeSave : false})

        return {accesstoken,refreshtoken};
    } catch (error) {
        throw new ApiError("502" , "Error coming while generating the access and refresh Tokens");
    }
}

// register the user 
const userregister = asyncHandler(async (req, res) => {
    const { fullName, email, userName, password } = req.body;

    if ([fullName, email, userName, password].some(
        (field) => !field || field.trim() === ""
    )) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "User already exists with this email or username"
        );
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    });

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});


// for login user into the data base 
const userLogin = asyncHandler(async (req,res) =>{
    // take the data
    // user email or username 
    // check into the database ? ya nahi 
    // password check 
    // refreshToken or AccessToken 

    // send cookie 

    const {userName , email , password} = req.body

    if(!userName && !email){
        throw new ApiError(404,"The email or username is mandoratory");
    }

    const user = await User.findOne({
        $or : [{userName} ,{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist");
    }


    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(404,"please give valid credential");
    }

    const {accesstoken,refreshtoken} = await generateAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")


    //cookie me kya kya ifformation bhejni hai
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken",accesstoken,options)
    .cookie("refreshToken",refreshtoken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser , refreshtoken,accesstoken
            },
            "user save successfully"
        )
    )

})



// For Logout Request Handle Karega 

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


// For refresh the Accessandrefresh token 
const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError("401","we are not able to fetch the Access and refresh token ")
    }

    try {
        const decodedToekn = jwt.verify(incomingRefreshToken , process.env.REFERESH_TOKEN_SECRET)
    
    
        const user = await User.findById(decodedToekn?._id)
    
        if(!user){
            throw new ApiError("400","Invalid refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError("400","rfresh token is expired or used")
        }
        
        const {accesstoken , newrefreshtoken} = await generateAndRefreshTokens(user._id)
        
        const options = {
            httpOnly : true,
            secure : true
        }
    
        return res
        .status(200)
        .cookie("accesstoken" , accesstoken , options)
        .cookie("refreshtoken" , newrefreshtoken , options)
        .json(
            new ApiResponse(
                200,
                {accesstoken , refreshToken : newrefreshtoken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError("502" , "while decoding the error is coming nahi ho pa raha ye decoded ");
    }
    
})

export { userregister, userLogin, logoutUser ,refreshAccessToken};