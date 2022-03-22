const User = require("../models/user.model");
const generateToken = require("../config/generateToken");

const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		res.status(400);
		throw new Error("Please enter all the fields");
	}

	const userExist = await User.findOne({ email });

	if (userExist) {
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
		// pic,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			pic: user.pic,
			// user,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Failed to create the user");
	}
});

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	// console.log(user);
	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.pic,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Invalid username or password");
	}
});

module.exports = { registerUser, authUser };
