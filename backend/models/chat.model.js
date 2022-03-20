// chatName
// isGroupChat
// users
// latestMessage

const { model, Schema } = require("mongoose");

const chatModel = new Schema(
	{
		chatName: {
			type: String,
			trim: true,
		},
		isGroupChat: {
			type: Boolean,
			default: false,
		},
		users: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		latestMessage: {
			type: Schema.Types.ObjectId,
			ref: "Message",
		},
		groupAdmin: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timeStamps: true,
	}
);

const Chat = model("Chat", chatModel);
module.exports = Chat;
