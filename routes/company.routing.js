import express from "express";

//? Controllers
import {
	companyRegister,
	companyUpdate,
	getCompany,
	getCompanyById,
} from "../controllers/company.controller.js";

//? MiddleWare
import authGuard from "../middleware/authGuard.js";

const router = express.Router();

router.route("/register").post(authGuard, companyRegister);
router.route("/get").get(authGuard, getCompany);
router.route("/get/:id").get(authGuard, getCompanyById);
router.route("/update/:id").put(authGuard, companyUpdate);

export default router;