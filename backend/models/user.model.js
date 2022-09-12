const bcrypt = require("bcryptjs");
const { model, Schema } = require("mongoose");

const userSchema = new Schema(
	{
		name: {
			type: String,
			requried: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		picture: {
			type: String,
			required: true,
			default:
				"https://cdn.pixabay.com/photo/2014/03/24/13/50/man-294556_960_720.png",
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = model("User", userSchema);
module.exports = User;
