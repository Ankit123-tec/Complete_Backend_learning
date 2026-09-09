import { asyncHandler } from "../utils/asyncHandler.js";

const userregister = asyncHandler(async (req, res) => {
    res.status(500).json({
        message : "Internal server Error"
    }) 
})


export default userregister