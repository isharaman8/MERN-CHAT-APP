const nodemailer = require("nodemailer");
module.exports = nodemailer.createTransport({
	service: "gmail",
	auth: {
		type: "oauth2",
		user: process.env.NODEMAILER_EMAIL,
		clientId: process.env.OAUTH_CLIENT_ID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
	},
});
