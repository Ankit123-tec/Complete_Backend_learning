import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {logoutUser,userLogin,userregister,refreshAccessToken} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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


export default router;