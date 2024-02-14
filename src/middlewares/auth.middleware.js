import { User } from "../models/users.model.js";
import { handleError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {   
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            return handleError(res, 401, "Unauthorized request!")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            return handleError(res, 401, "Invalid Access Token!")
        }

        req.user = user;
        next()

    } catch (error) {
        return handleError(res, 401, "Invalid Access Token!")
    }
})