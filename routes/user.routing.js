import express from "express";

//? Controllers
import {
	updateFcmToken,
	userLogin,
	userLogout,
	userRegistration,
	userUpdateProfile,
} from "../controllers/user.controller.js";

//? MiddleWare
import authGuard from "../middleware/authGuard.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/login").post(userLogin);
router.route("/register").post(singleUpload, userRegistration);
router.route("/logout").get(userLogout);
router.route("/update-fcm-token").post(authGuard, updateFcmToken);
router.route("/update-profile").post(authGuard, singleUpload, userUpdateProfile);

export default router;
