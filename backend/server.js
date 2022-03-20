const express = require("express");
const chats = require("./data/data");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());

app.get("/", async (req, res) => {
	try {
		return res.status(200).send({ api: true });
	} catch (err) {
		console.log(err);
	}
});

app.get("/api/chat", async (req, res) => {
	return res.send(chats);
});

app.get("/api/chat/:id", async (req, res) => {
	// console.log(req.params);
	const retVal = chats.find((one) => one._id === req.params.id);
	return res.status(200).send({ id: req.params.id, chat: retVal });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log("App is listening on port " + PORT);
});
