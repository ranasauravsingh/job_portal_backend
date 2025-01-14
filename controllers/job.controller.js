import { Job } from "../models/job.schema.js";
import { handleError } from "../_helpers/common_helper.js";

export const postJob = async (req, res) => {
	try {
		const {
			title,
			description,
			requirements,
			salary,
			location,
			jobType,
			experience,
			positions,
			companyId,
		} = req?.body;

		const userId = req?.id; //? middleware authentication

		if (
			!title ||
			!description ||
			!requirements ||
			!salary ||
			!location ||
			!jobType ||
			!experience ||
			!positions ||
			!companyId
		) {
			return res.status(400).json({
				message: "Something is missing.",
				success: false,
			});
		}
		const job = await Job.create({
			title,
			description,
			requirements: requirements
				?.split(",")
				?.map((requirement) => requirement?.trim()),
			salary: Number(salary),
			location,
			jobType,
			experienceLevel: Number(experience),
			positions: Number(positions),
			company: companyId,
			createdBy: userId,
		});

		return res.status(201).json({
			message: "New job created successfully.",
			data: job,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const getAdminJobs = async (req, res) => {
	try {
		const adminId = req?.id;         //? middleware authentication

		const jobs = await Job.find({ createdBy: adminId }).populate({
			path: "company",
			createdAt: -1,
		});
		if (!jobs) {
			return res.status(404).json({
				message: "Jobs not found.",
				success: false,
			});
		}

		return res.status(200).json({
			data: jobs,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const getAllJobs = async (req, res) => {
	try {
		const keyword = req?.query?.keyword || "";              //? Filter keyword

        //? created query for filtration
		const query = {
			$or: [
				{ title: { $regex: keyword, $options: "i" } },
				{ description: { $regex: keyword, $options: "i" } },
			],
		};
		const jobs = await Job.find(query)
			.populate({
				path: "company",
			})
			.sort({ createdAt: -1 });
		if (!jobs) {
			return res.status(404).json({
				message: "Jobs not found.",
				success: false,
			});
		}

		return res.status(200).json({
			data: jobs,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const getJobById = async (req, res) => {
	try {
		const jobId = req?.params?.id;

		const job = await Job.findById(jobId).populate({
			path: "applications",
		});
		if (!job) {
			return res.status(404).json({
				message: "Jobs not found.",
				success: false,
			});
		}

		return res.status(200).json({ data: job, success: true });
	} catch (error) {
		handleError(res, error);
	}
};

export const jobUpdate = async (req, res) => {
	try {
		const {
			title,
			description,
			requirements,
			salary,
			location,
			jobType,
			experience,
			positions,
			companyId,
		} = req?.body;

		if (
			!title ||
			!description ||
			!requirements ||
			!salary ||
			!location ||
			!jobType ||
			!experience ||
			!positions ||
			!companyId
		) {
			return res.status(400).json({
				message: "Something is missing.",
				success: false,
			});
		}

		const updatedData = {
			title,
			description,
			requirements: requirements
				?.split(",")
				?.map((requirement) => requirement?.trim()),
			salary: Number(salary),
			location,
			jobType,
			experienceLevel: Number(experience),
			positions: Number(positions),
			company: companyId,
		};

		const jobId = req?.params?.id;

		const job = await Job.findByIdAndUpdate(jobId, updatedData, {
			new: true,
		});

		if (!job) {
			return res.status(404).json({
				message: "Job not found.",
				success: false,
			});
		}

		return res.status(200).json({
			message: "Job information updated.",
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};
