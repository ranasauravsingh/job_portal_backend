import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//? DataBase connection
import DBConnect from "./db/connect.js";

//? MiddleWare
import authGuard from "./middleware/authGuard.js";

//? Routes
import userRoute from "./routes/user.routing.js";
import companyRoute from "./routes/company.routing.js";
import jobRoute from "./routes/job.routing.js";
import applicationRoute from "./routes/application.routing.js";

const app = express();

//? Fetching ENV variables
dotenv.config({
	path: "./.env",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
	origin: process.env.FRONTEND_DOMAIN,
	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));


//? API's
const API = "/api";

app.use(`${API}/user`, userRoute);
app.use(`${API}/company`, companyRoute);
app.use(`${API}/job`, jobRoute);
app.use(`${API}/application`, applicationRoute);


//? PORT Listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	DBConnect();

	console.log(`Server is listening at port ${PORT}`);
});
