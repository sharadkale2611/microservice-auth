import { Router } from "express";
import {
    listUsers,
    createUser,
    loginUser,
    logoutUser,
    currentUserDetails
} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { reqFormDataOnly } from "../middlewares/formDataOnly.middleware.js";
import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory for this example
const upload = multer({ storage: storage });

const router = Router()

router.route("/register").post( upload.single('avatar'), createUser)
router.route("/login").post(loginUser)

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/profile").get(verifyJWT, currentUserDetails)

router.route("/list").get(verifyJWT, listUsers)

export default router