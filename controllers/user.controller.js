import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.schema.js";
import { handleError } from "../_helpers/common_helper.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const userRegistration = async (req, res) => {
	try {
		const { fullName, email, password, phoneNumber, role } = req?.body;

		if (!fullName || !email || !password || !phoneNumber || !role) {
			return res.status(400).json({
				message: "Something is missing",
				success: false,
			});
		}

		const file = req?.file;
		const fileUri = getDataUri(file);
		const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				message: "User already exists with this email.",
				success: false,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await User.create({
			fullName,
			email,
			phoneNumber,
			password: hashedPassword,
			role,
			profile: {
				profilePhoto: (cloudResponse && cloudResponse.secure_url) || "",
			},
		});

		return res.status(201).json({
			message: `Account created successfully.`,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const userLogin = async (req, res) => {
	const JWT_SECRET = process.env.JWT_SECRET_KEY;

	try {
		const { email, password, role } = req?.body;

		if (!email || !password || !role) {
			return res.status(400).json({
				message: "Something is missing",
				success: false,
			});
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message: "User does not exists with this email.",
				success: false,
			});
		}

		const isPasswordMatch = await bcrypt.compare(password, user?.password);
		if (!isPasswordMatch) {
			return res.status(400).json({
				message: "Invalid password.",
				success: false,
			});
		}

		//? Check if role is correct or not
		if (Boolean(role !== user?.role)) {
			return res.status(400).json({
				message: "Account doesn't exist with current role.",
				success: false,
			});
		}

		//? Generate JWT token
		const tokenData = {
			userID: user?._id,
		};
		const token = await jwt?.sign(tokenData, JWT_SECRET, {
			expiresIn: "1d",
		});

		const responseUser = {
			_id: user?.id,
			email: user?.email,
			fullName: user?.fullName,
			phoneNumber: user?.phoneNumber,
			role: user?.role,
			profile: user?.profile,
		};

		return res
			.status(200)
			.cookie(`token`, token, {
				maxAge: 1 * 24 * 60 * 60 * 1000,
				httpsOnly: true,
				secure: true,
				sameSite: "none",
			})
			.json({
				message: `Welcome back, ${user?.fullName}`,
				data: {
					user: responseUser,
				},
				success: true,
			});
	} catch (error) {
		handleError(res, error);
	}
};

export const userLogout = async (req, res) => {
	try {
		const userId = req?.id; //? middleware authentication

		return res.status(200).cookie(`token`, "", { maxAge: 0 }).json({
			message: "User logged out successfully.",
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const userUpdateProfile = async (req, res) => {
	try {
		const { fullName, email, bio, phoneNumber, skills } = req?.body;
		const file = req?.file;

		// if (!fullName || !email || !bio || !phoneNumber || !skills) {
		// 	return res.status(400).json({
		// 		message: "Something is missing",
		// 		success: false,
		// 	});
		// }

		//? File cloudinary comes here later on...

		const fileUri = getDataUri(file);
		const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

		const userId = req?.id; //? middleware authentication
		const user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({
				message: "User does not exists.",
				success: false,
			});
		}

		let updatedUserData = {};

		if (fullName) {
			updatedUserData = {
				...updatedUserData,
				fullName,
			};
		}
		if (email) {
			updatedUserData = {
				...updatedUserData,
				email,
			};
		}
		if (phoneNumber) {
			updatedUserData = {
				...updatedUserData,
				phoneNumber,
			};
		}
		if (bio || skills) {
			updatedUserData = {
				...updatedUserData,
				profile: {
					...user?.profile,
					bio,
					skills: skills?.split(",")?.map((skill) => skill?.trim()),
				},
			};
		}

		//? Resume comes here later on...
		if (cloudResponse) {
			updatedUserData = {
				...updatedUserData,
				profile: {
					...updatedUserData?.profile,
					resume: cloudResponse.secure_url, // save the cloudinary url
					resumeName: file.originalname, // Save the original file name
				},
			};
		}

		await user.set(updatedUserData);
		await user.save();

		const responseUser = {
			_id: user?.id,
			email: user?.email,
			fullName: user?.fullName,
			phoneNumber: user?.phoneNumber,
			role: user?.role,
			profile: user?.profile,
		};

		return res.status(200).json({
			message: `Profile updated successfully, ${user?.fullName}`,
			data: {
				user: responseUser,
			},
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};
