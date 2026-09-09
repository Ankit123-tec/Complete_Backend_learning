import {v2 as cloudinary } from "cloudinary"

import fs from "fs"


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_API_NAME,
    api_secret:process.env.CLOUDINARY_CLOUD_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath) return null;

        // upload the file on cloudinary
        const response = await cloudinary.v2.uploader.upload(localFilePath,{
            resource_type : "auto"
        })
        console.log(response.url);

        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath) // rmove the locally saved current file if the work is not correct ; 
        return null;
    }
}

export {uploadOnCloudinary}