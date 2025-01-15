import axios from "axios";
import getFcmAccessToken from "../utils/fetchFCMAccessToken.js";

export const handleError = (res, error) => {
	return res.status(400).json({ error: `Something went wrong: ${error}` });
};

export const sendFcmNotification = async (fcmToken, notificationPayload) => {
	try {
		const accessFcmToken = await getFcmAccessToken();
		const googleFcmUrl = `https://fcm.googleapis.com/v1/projects/${process.env.FCM_PROJECT_ID}/messages:send`;

		const fcmPayload = {
			message: {
				token: fcmToken,
				notification: {
					title: notificationPayload?.title,
					body: notificationPayload?.body,
				},
				data: notificationPayload?.data || {},
			},
		};

		const fcmResponseData = await axios.post(googleFcmUrl, fcmPayload, {
			headers: {
				Authorization: `Bearer ${accessFcmToken}`,
				"Content-Type": "application/json",
			},
		});

		return fcmResponseData?.data;
	} catch (error) {
		console.error(
			"Error sending message:",
			error?.response?.data || error?.message
		);
		throw error;
	}
};
