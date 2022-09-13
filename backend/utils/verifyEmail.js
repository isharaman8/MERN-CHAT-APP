const verifier = require("email-verify");
const util = require("util");

const checkemail = async (email) => {
	const promisifiedVerifier = util.promisify(verifier.verify);
	try {
		const data = await promisifiedVerifier(email);
		return data;
	} catch (error) {
		console.log(error);
	}
};

module.exports = checkemail;
