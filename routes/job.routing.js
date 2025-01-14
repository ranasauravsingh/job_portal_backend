import express from "express";

//? Controllers;
import {
	getAdminJobs,
	getAllJobs,
	getJobById,
	postJob,
	jobUpdate,
} from "../controllers/job.controller.js";

//? MiddleWare
import authGuard from "../middleware/authGuard.js";

const router = express.Router();

router.route("/post").post(authGuard, postJob);
router.route("/get").get(getAllJobs);
// router.route("/get").get(authGuard, getAllJobs);
router.route("/get-admin-jobs").get(authGuard, getAdminJobs);
router.route("/get/:id").get(authGuard, getJobById);
router.route("/update/:id").put(authGuard, jobUpdate);

export default router;
