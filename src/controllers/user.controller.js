import { User } from "../models/users.model.js";
import Joi from "@hapi/joi"
import { ApiError, handleError, handleValidationError } from "../utils/apiError.util.js"
import { asyncHandler } from "../utils/asyncHandler.util.js"

// For Cookies
const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const newRefreshToken = user.generateRefreshToken()

        user.refreshToken = newRefreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, newRefreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

// Register user
const createUser = asyncHandler(async (req, res) => {
    
    const { fullName, username, email, mobileNumber, password } = req.body

    const schema = Joi.object({
        fullName: Joi.string(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        mobileNumber: Joi.string()
            .pattern(/^[0-9]{10}$/) // Assuming a 10-digit mobile number; adjust as needed
            .required()
            .messages({
                'string.pattern.base': 'Mobile number must be a 10-digit numeric value',
            }),
        password: Joi.string().min(6).max(30).required(),
        avatar: Joi.string()
    });

    const isValidated = handleValidationError(req, res, schema);
    if (isValidated !== true) return isValidated;


    const existUser = await User.findOne({
        $or: [{ username }, { email }, { mobileNumber }]
    })

    if (existUser) {
        return handleError(res, 409, "User with Mobile number, email or username already exists")
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        mobileNumber,
        password
    })

    return res.status(200).json({
        success: true,
        message: "User created successfully!",
        data: user
    })

})

const loginUser = asyncHandler(async (req, res) => {

    const { username, email, mobileNumber, password } = req.body

    const schema = Joi.object({
        username: Joi.string(),
        email: Joi.string().email(),
        mobileNumber: Joi.string()
            .pattern(/^[0-9]{10}$/) // Assuming a 10-digit mobile number; adjust as needed
            .messages({
                'string.pattern.base': 'Mobile number must be a 10-digit numeric value',
            }),
        password: Joi.string().required(),

    })
        .or('username', 'email', 'mobileNumber').required()   // get input atleast one of them
        .messages({
            'object.missing': 'Please provide at least one of username, email, or mobileNumber.'
        })
        .xor('username', 'email', 'mobileNumber')         // get input from any one field only
        .messages({
            'object.xor': 'Please provide only one of Username, Email, or Mobile Number.',
        });

    const isValidated = handleValidationError(req, res, schema);
    if (isValidated !== true) return isValidated;

    const user = await User.findOne({
        $or: [{ username }, { email }, { mobileNumber }]
    })

    if (!user) {
        return handleError(res, 404, "Invalid Credentials!")
    }


    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return handleError(res, 404, "Invalid Credentials!!")
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            success: true,
            message: "Login successfully!",
            data: loggedInUser,
            accessToken,
            refreshToken: newRefreshToken
        })


})


const logoutUser = async(req, res) => {

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1      // This removes field from document
            }
        },
        {
            new:true
        }
    )

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        success: true,
        message: "Logout successfully!",
        data: null,

    })

}

const currentUserDetails = (req, res) => {

    return res.status(200)
    .json({
        success: true,
        message: "User details fetched successfully!",
        data: req.user,

    })


}


const listUsers = () => {
    console.log("This is user List page from controller");
    return "Hello"
}


export {
    createUser,
    loginUser,
    logoutUser,
    currentUserDetails,
    listUsers
}