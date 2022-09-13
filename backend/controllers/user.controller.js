const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const generateToken = require("../config/generateToken");
const validateEmail = require("../utils/emailRegex");
const sendMail = require("../config/nodemailer");
const checkemail = require("../utils/verifyEmail");

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, pic } = req.body;
	// console.log(name, email, pic);
	if (!name || !email || !password || !pic) {
		res.status(400);
		throw new Error("Please enter all the fields");
	}
	// console.log(name, pic, email, password);
	const userExist = await User.findOne({ email });

	if (userExist) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
		picture: pic,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			pic: user.picture,
			// user,
			token: generateToken(user._id),
		});
	} else {
		res.status(StatusCodes.BAD_REQUEST);
		throw new Error("Failed to create the user");
	}
});

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (email === "guest@example.com") {
		let dummyuser = await User.findOne({ email });
		if (!dummyuser)
			dummyuser = await User.create({
				name: "Dummy account",
				email,
				pic: "https://www.cornwallbusinessawards.co.uk/wp-content/uploads/2017/11/dummy450x450-300x300.jpg",
				password: "dummypassword",
			});

		const token = generateToken(dummyuser._id);

		return res.status(StatusCodes.OK).send({
			name: dummyuser.name,
			email,
			pic: dummyuser.pic,
			token,
			_id: dummyuser._id,
		});
	}

	const user = await User.findOne({ email });
	if (!user) throw new Error("Invalid email / password");

	const checkPassword = await user.matchPassword(password);
	if (user && checkPassword) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			pic: user.picture,
			token: generateToken(user._id),
		});
	} else {
		res.status(StatusCodes.UNAUTHORIZED);
		throw new Error("Invalid email / password");
	}
});

// api/user?search=piyush
const allusers = asyncHandler(async (req, res) => {
	const keyword = req.query.search
		? {
				$or: [
					{ name: { $regex: req.query.search, $options: "i" } },
					{ email: { $regex: req.query.search, $options: "i" } },
				],
		  }
		: {};

	const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
	return res.status(StatusCodes.OK).send(users);
	// console.log(keyword);
});

const resetPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;
	if (!email) throw new Error("Please provide email");
	if (!validateEmail(email)) throw new Error("Provide valid email");

	const checkuser = await User.findOne({ email });

	if (!checkuser) throw new Error("No user found");

	const token = generateToken(checkuser._id);

	const sendingurl = `http://localhost:5000/api/user/resetpassword/${token}`;

	// TODO: ADD TO SIGNUP const emailcheck1 = await checkemail("aaaadfasddddd@gmail.com");
	// TODO: ADD TO SIGNUP -> if (emailcheck1.success === false) throw new Error("Invalid email");

	const data = await sendMail(
		email,
		"Reset password mail",
		`Here is your reset password link: ${sendingurl}`
	);

	if (data?.data?.accepted?.length < 1) throw new Error("Something went wrong");
	return res
		.status(StatusCodes.OK)
		.send({ data, mailsend: true, message: `Mail sent successfully` });
});

const redirectUrl = asyncHandler(async (req, res) => {
	const { tokenid } = req.params;
	if (!tokenid) throw new Error("No token provided");
	const verifytoken = jwt.verify(tokenid, process.env.JWT_SECRET);

	if (!verifytoken) throw new Error("Invalid token");

	console.log(verifytoken);

	const FRONTEND_REDIRECT_URL = `http://localhost:3000/resetpassword/${verifytoken.id}`;

	return res.redirect(FRONTEND_REDIRECT_URL);
});

const setNewPassword = asyncHandler(async (req, res) => {
	const { password, id } = req.body;
	if (!password || !id) throw new Error("Token / Password missing");

	// const verifytoken = jwt.verify(token, process.env.JWT_SECRET);

	// if (!verifytoken) throw new Error("Invalid token");

	const salt = await bcrypt.genSalt(10);
	const hashedpassword = await bcrypt.hash(password, salt);

	const updateuser = await User.findByIdAndUpdate(
		id,
		{
			password: hashedpassword,
		},
		{ new: true }
	);

	if (!updateuser) throw new Error("No user found");

	return res.status(StatusCodes.OK).send(updateuser);
});

module.exports = {
	registerUser,
	authUser,
	allusers,
	resetPassword,
	redirectUrl,
	setNewPassword,
};
