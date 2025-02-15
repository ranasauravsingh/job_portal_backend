import { Job } from "../models/job.schema.js";
import { User } from "../models/user.schema.js";
import { Application } from "../models/application.schema.js";
import { handleError, sendFcmNotification } from "../_helpers/common_helper.js";

export const applyJob = async (req, res) => {
	try {
		const userId = req?.id; //? middleware authentication
		const jobId = req?.params?.id;

		if (!jobId) {
			return res.status(400).json({
				message: "Job id is required.",
				success: false,
			});
		}

		// check if the user has already applied for the job
		const existingApplication = await Application.findOne({
			job: jobId,
			applicant: userId,
		});
		if (existingApplication) {
			return res.status(400).json({
				message: "You have already applied for this jobs",
				success: false,
			});
		}

		// check if the jobs exists
		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).json({
				message: "Job not found",
				success: false,
			});
		}

		// create a new application
		const newApplication = await Application.create({
			job: jobId,
			applicant: userId,
		});

		job.applications.push(newApplication?._id);
		await job.save();
		return res.status(201).json({
			message: "Job applied successfully.",
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const getAppliedJobs = async (req, res) => {
	try {
		const userId = req?.id; //? middleware authentication
		const application = await Application.find({ applicant: userId })
			.sort({ createdAt: -1 })
			.populate({
				path: "job",
				options: { sort: { createdAt: -1 } },
				populate: {
					path: "company",
					options: { sort: { createdAt: -1 } },
				},
			});
		if (!application) {
			return res.status(404).json({
				message: "No Applications",
				success: false,
			});
		}

		return res.status(200).json({
			data: application,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

// for recruiter
export const getApplicants = async (req, res) => {
	try {
		const jobId = req?.params?.id;
		const job = await Job.findById(jobId).populate({
			path: "applications",
			options: { sort: { createdAt: -1 } },
			populate: {
				path: "applicant",
			},
		});
		if (!job) {
			return res.status(404).json({
				message: "Job not found.",
				success: false,
			});
		}

		return res.status(200).json({
			data: job,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const updateStatus = async (req, res) => {
	try {
		const { status } = req?.body;
		const applicationId = req?.params?.id;
		if (!status) {
			return res.status(400).json({
				message: "status is required",
				success: false,
			});
		}

		// find the application by Application id
		const application = await Application.findOne({ _id: applicationId });
		if (!application) {
			return res.status(404).json({
				message: "Application not found.",
				success: false,
			});
		}

		// update the status
		application.status = status?.toLowerCase();
		await application.save();

		const user = await User.findById(application?.applicant);

		// ? Send notification to the user
		if (user) {
			const notificationPayload = {
				title: "Application Status Updated",
				body: `Your application status has been updated to ${status}`,
				data: {
					type: "application_status",
					applicationId: applicationId,
				},
			};

			if (user?.deviceInfo?.length > 0) {
				user?.deviceInfo?.forEach(async (device) => {
					if (device?.userFcmToken) {
						await sendFcmNotification(
							device?.userFcmToken,
							notificationPayload
						);
					}
				});
			}
		}

		return res.status(200).json({
			message: "Status updated successfully.",
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};
