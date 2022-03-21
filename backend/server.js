const express = require("express");
// const chats = require("./data/data");
const cors = require("cors");
const connect = require("./config/connect");
const userRoutes = require("./routes/user.routes");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
	try {
		return res.status(200).send({ api: true });
	} catch (err) {
		console.log(err);
	}
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
	try {
		await connect(process.env.MONGO_URI);
		console.log("App is listening on port " + PORT);
	} catch (err) {
		console.log("Error", err);
	}
});
