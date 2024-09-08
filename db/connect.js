import mongoose from "mongoose";

const DBConnect = async () => {
	const DB = process.env.DATABASE;
	try {
		await mongoose.connect(DB);

		console.log("Connection with Mongo DB successful!!!");
	} catch (err) {
		console.log("Connection Failure--> ", err);
	}
};

export default DBConnect;
