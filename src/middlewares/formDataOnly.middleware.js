import { handleError } from "../utils/apiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";


export const reqFormDataOnly = asyncHandler(async(req,res,next)=>{

    try {
        console.log(req.headers);
            const contentType = req.headers['content-type'];
            if(!contentType){
                console.log('Content Type is undefined');
                return handleError(res, 400, "Unsupported content type")
            }else if (!contentType.includes('multipart/form-data')) {
                console.log('Unsupported content type');
                return handleError(res, 400, "Unsupported content type")
            }
            next()
        
    } catch (error) {
        return handleError(res, 401, "Unsupported content type!")
        
    }



})