const User = require("../models/user.model");
const generateToken = require("../config/generateToken");

const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, pic } = req.body;
	console.log(name, email, pic);
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
			email: user.email,
			pic: user.picture,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Invalid username or password");
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
	return res.status(200).send(users);
	// console.log(keyword);
});

module.exports = { registerUser, authUser, allusers };
