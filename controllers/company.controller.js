import { Company } from "../models/company.schema.js";
import { handleError } from "../_helpers/common_helper.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const companyRegister = async (req, res) => {
	try {
		const { companyName } = req?.body;
		if (!companyName) {
			return res.status(400).json({
				message: "Company name is missing",
				success: false,
			});
		}

		const company = await Company.findOne({ name: companyName });
		if (company) {
			return res.status(400).json({
				message: "Company is already registered.",
				success: false,
			});
		}

		const userID = req?.id; //? middleware authentication

		const newCompany = await Company.create({
			name: companyName,
			userID,
		});

		return res.status(201).json({
			message: "Company registered successfully.",
			data: newCompany,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const getCompany = async (req, res) => {
	try {
		const userID = req?.id; //? middleware authentication

		const companies = await Company.find({ userID });
		if (!companies) {
			return res.status(404).json({
				message: "Companies not found.",
				success: false,
			});
		}

		return res.status(200).json({
			message: "Companies fetched successfully.",
			data: companies,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const getCompanyById = async (req, res) => {
	try {
		const companyId = req?.params?.id;
		const company = await Company.findById(companyId);
		if (!company) {
			return res.status(404).json({
				message: "Company not found.",
				success: false,
			});
		}

		return res.status(200).json({
			message: "Company fetched successfully.",
			data: company,
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};

export const companyUpdate = async (req, res) => {
	try {
		const { name, description, website, location } = req?.body;
		const file = req?.file;

		const fileUri = getDataUri(file);
		const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

		const updateData = {
			name,
			description,
			website,
			location,
			logo: (cloudResponse && cloudResponse.secure_url) || "",
		};
		const companyId = req?.params?.id;

		const company = await Company.findByIdAndUpdate(companyId, updateData, {
			new: true,
		});

		if (!company) {
			return res.status(404).json({
				message: "Company not found.",
				success: false,
			});
		}
		return res.status(200).json({
			message: "Company information updated.",
			success: true,
		});
	} catch (error) {
		handleError(res, error);
	}
};
