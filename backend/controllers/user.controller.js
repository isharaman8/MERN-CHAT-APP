const User = require("../models/user.model");
const generateToken = require("../config/generateToken");

const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

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

	console.log("Email and password", email, password);

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

const resetPassword = async (req, res) => {
	const { email } = req.body;
	if (!email) throw new Error("Please provide email");
};

module.exports = { registerUser, authUser, allusers };
