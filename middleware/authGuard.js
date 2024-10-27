import jwt from "jsonwebtoken";

import { handleError } from "../_helpers/common_helper.js";

// MIDDLEWARE
const authGuard = async (req, res, next) => {
	console.log("Middle Ware working");

	const JWT_SECRET = process.env.JWT_SECRET_KEY;

	try {

		console.log("req--->", req);

		const token = req?.cookies?.token;
		if (!token) {
			return res.status(401).json({
				message: "User not authenticated.",
				success: false,
			});
		}

		const decode = await jwt.verify(token, JWT_SECRET);

		if (!decode) {
			return res.status(401).json({
				message: "Invalid token.",
				success: false,
			});
		}

		req.id = decode?.userID;
		next();
	} catch (err) {
		handleError(res, err);
	}
};

export default authGuard;
