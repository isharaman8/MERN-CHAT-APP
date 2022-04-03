const express = require("express");
// const chats = require("./data/data");
const cors = require("cors");
const connect = require("./config/connect");

// Routes
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");

// Error handlers
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
	try {
		await connect(process.env.MONGO_URI);
		console.log("App is listening on port " + PORT);
	} catch (err) {
		console.log("Error", err);
	}
});

const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("Connected to socket.io");

	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});

	socket.on("typing", (room) => socket.in(room).emit("typing"));
	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("join chat", (room) => {
		socket.join(room);
		console.log("user joined room " + room);
	});

	socket.on("new message", (newMessage) => {
		var chat = newMessage.chat;
		if (!chat.users) return console.log("chat.users not defined");
		chat.users.forEach((user) => {
			if (user._id === newMessage.sender._id) return;
			socket.in(user._id).emit("message received", newMessage);
		});
	});
	socket.off("setup", () => {
		console.log("USER DISCONNECTED");
		socket.leave(userData._id);
	});
});
