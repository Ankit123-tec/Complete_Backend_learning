import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { access } from "fs";
import mongoose from "mongoose";


const cookieOptions = {
    httpOnly: true,
    secure: false
};


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

    const { accessToken, refreshToken } = await generateAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                refreshToken,
                accessToken
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

    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


// For refresh the Accessandrefresh token 
const refreshAccessToken = async (userId) => {

    try {

        const user =
            await User.findById(userId);


        const accessToken =
            user.generateAccessToken();


        const refreshToken =
            user.generaterefreshToken();


        user.refreshToken =
            refreshToken;


        await user.save({
            validateBeforeSave: false
        });


        return {
            accessToken,
            refreshToken
        };

    } catch (error) {

        throw new ApiError(
            502,
            "Error coming while generating access and refresh tokens"
        );

    }
};


// for changing the password

const changePassword = asyncHandler(async(req,res) =>{
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const checkThePassword = await user.isPasswordCorrect(oldPassword);

    if(!checkThePassword){
        throw new ApiError(404, "the Old password are not match");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res 
    .status(200)
    .json(new ApiResponse(200, {}, "The password update successfully !!!!! "));

})

// get The currentuser 

const getCurrentUser = asyncHandler(async(req,res) =>{
    return res.status(200).json(
        new ApiResponse(200, req.user, "user current fetched the data successfully")
    );
})

// complete update the details 

const updateTheDeatils = asyncHandler(async(req,res)=>{
    const { email, fullName } = req.body;

    if(!fullName || !email){
        throw new ApiError(400, "All fields are mandotary");
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                fullName,
                email : email
            }
        },
        {
            new : true
        }
    ).select("-password");

    return res.status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
})


const updateUserAvtar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avtar file is not in here");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar?.url){
        throw new ApiError(400, "Error while uploading on Avtar");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                avatar : avatar.url
            }
        },
        { new : true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "Avtar updated successfully")
    );
 })
const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const LocalcoverImagePath = req.file?.path;

    if(!LocalcoverImagePath){
        throw new ApiError(400, "coverImage file is not in here");
    }

    const coverImage = await uploadOnCloudinary(LocalcoverImagePath);

    if(!coverImage?.url){
        throw new ApiError(400, "Error while uploading on coverImage");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                coverImage : coverImage.url
            }
        },
        { new : true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "cover image updated successfully")
    );
 })

const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {userName} = req.params

    if(!userName?.trim()){
        throw new ApiError(400,"username is missing")
    }

    const channel = await User.aggregate([
        //first pipeline 
        {
            $match :{
                userName: userName?.toLowerCase()
            }
        },
        // second pipeline
        {
            $lookup:{
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscribers"
            }
        },
        // third pipeline 
        {
            $lookup:{
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "subscribeTo"
            }
        },
        // fourth pipeline 
        {
            $addFields : {
                subscriptionCount : {
                    $size : "$subscribers",
                },
                channelsSubscriberCount :{
                    $size : "$subscribeTo"
                },
                isSubscribed:{
                    $cond :{
                        if:{$in : [req.user?._id , "$subscribers.subscriber"]}
                    }
                }
            }
        }
        // fivth pipeline
        ,{
            $project : {
                fullname : 1,
                username : 1,
                subscriptionCount:1,
                channelsSubscriberCount : 1,
                isSubscribed : 1,
                avtar : 1,
                coverImage : 1,
                email : 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404 , "channel does not exist");
    }


    return res.status(200)
    .json(
        new ApiResponse(200 , channel[0], "channel get Successfully")
    )
})

const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup :{
                from : "videos",
                localField : "watchHistory",
                foreignField : "_id",
                as : "watchHistory",
                pipeline :[
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline :[
                                {
                                    $project :{
                                        fullname : 1,
                                        userName : 1,
                                        avatar : 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields :{
                            owner :{
                                $first : "$owner",
                            }
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).
    json(
        new ApiResponse (
            200,
            user[0]?.watchHistory || [],
            "watch history fetched successfully "
        )
    )
})

export { userregister, userLogin, logoutUser ,refreshAccessToken,changePassword,getCurrentUser,updateTheDeatils
    ,updateUserAvtar,updateUserCoverImage , getUserChannelProfile,getWatchHistory
};
