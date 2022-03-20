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

const User = model("User", userSchema);
module.exports = User;
