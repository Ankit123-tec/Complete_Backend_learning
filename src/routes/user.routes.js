import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {logoutUser,userLogin,userregister,refreshAccessToken,changePassword,getCurrentUser,updateTheDeatils,updateUserAvtar,updateUserCoverImage,getUserChannelProfile,getWatchHistory} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();


// userregister
router.post(
    "/register",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    userregister
);


// login user
router.post("/login",userLogin)


// logout user
router.post("/logout",verifyJWT,logoutUser)

// refresh the Access and refresh token 
router.post("/refreshAccessToken", refreshAccessToken);

router.post("/change-password",verifyJWT, changePassword);

router.get("/get-current-user-data" ,verifyJWT, getCurrentUser);

router.patch("/update_details",verifyJWT,updateTheDeatils);


router.patch("/avtar-update", verifyJWT, upload.single("avatar"), updateUserAvtar);

router.patch("/coverImage-update", verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.post("/c/:userName" , verifyJWT ,getUserChannelProfile )

router.get("/watch-History", verifyJWT, getWatchHistory);


export default router;