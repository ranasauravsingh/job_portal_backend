import admin from "../_helpers/firebase/firebase.js";

const getFcmAccessToken = async () => {
	const token = await admin.credential
		.cert(admin.app().options.credential)
		.getAccessToken();
	return token?.access_token;
};

export default getFcmAccessToken;
