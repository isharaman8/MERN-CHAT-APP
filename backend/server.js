const express = require("express");
// const chats = require("./data/data");
const cors = require("cors");
const connect = require("./config/connect");

// Routes
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");

// Error handlers
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
	try {
		await connect(process.env.MONGO_URI);
		console.log("App is listening on port " + PORT);
	} catch (err) {
		console.log("Error", err);
	}
});
