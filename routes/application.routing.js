import express from "express";

//? Controllers;
import {
	applyJob,
	getApplicants,
	getAppliedJobs,
	updateStatus,
} from "../controllers/application.controller.js";

//? MiddleWare
import authGuard from "../middleware/authGuard.js";

const router = express.Router();

router.route("/apply/:id").get(authGuard, applyJob);
router.route("/get").get(authGuard, getAppliedJobs);
router.route("/applicants/:id").get(authGuard, getApplicants);
router.route("/status/update/:id").post(authGuard, updateStatus);

export default router;
