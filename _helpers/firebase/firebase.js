import path from "path";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { fileURLToPath } from "url";
// import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
	path: path.resolve(__dirname, "../../.env"), // Adjust the path as needed
});

const serviceAccount = {
	type: "service_account",
	project_id: process.env.FCM_PROJECT_ID,
	private_key_id: process.env.FCM_PRIVATE_KEY_ID,
	private_key: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, "\n"),
	client_email: process.env.FCM_CLIENT_EMAIL,
	client_id: process.env.FCM_CLIENT_ID,
	auth_uri: process.env.FCM_AUTH_URI,
	token_uri: process.env.FCM_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.FCM_AUTH_PROVIDER_CERT_URL,
	client_x509_cert_url: process.env.FCM_CLIENT_CERT_URL,
	universe_domain: process.env.FCM_UNIVERSE_DOMAIN,
};

console.log("serviceAccount--->", serviceAccount);

// Initialize Firebase Admin SDK
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export default admin;
