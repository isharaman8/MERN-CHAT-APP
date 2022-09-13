const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI;
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
const EMAIL = "jacobreynolds4207@gmail.com";

// ? console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN);

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(mail, subject, text) {
	try {
		const accesstoken = await oAuth2Client.getAccessToken();
		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: EMAIL,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accesstoken,
			},
		});

		const mailOptions = {
			from: `AMAN KUMAR <${EMAIL}>`,
			to: mail,
			subject,
			text,
		};

		const result = await transport.sendMail(mailOptions);
		console.log(result);
		return result;
	} catch (error) {
		console.log("ERRROR", error);
		return error;
	}
}

module.exports = sendMail;

// module.exports = nodemailer.createTransport({
// 	service: "gmail",
// 	auth: {
// 		type: "oauth2",
// 		user: process.env.NODEMAILER_EMAIL,
// 		clientId: process.env.OAUTH_CLIENT_ID,
// 		clientSecret: process.env.OAUTH_CLIENT_SECRET,
// 	},
// });
