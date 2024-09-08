import express from "express";

//? Controllers
import {
	userLogin,
	userLogout,
	userRegistration,
	userUpdateProfile,
} from "../controllers/user.controller.js";

//? MiddleWare
import authGuard from "../middleware/authGuard.js";

const router = express.Router();

router.route("/login").post(userLogin);
router.route("/register").post(userRegistration);
router.route("/logout").post(authGuard, userLogout);
router.route("/update-profile").post(authGuard, userUpdateProfile);

export default router;
