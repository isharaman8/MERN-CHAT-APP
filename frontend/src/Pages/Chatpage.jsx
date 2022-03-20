import React, { useEffect, useState } from "react";
import axios from "axios";

const Chatpage = () => {
	const [chats, setChats] = useState([]);
	const fetchChats = async () => {
		const { data } = await axios.get("http://localhost:5000/api/chat");
		// console.log(data);
		setChats(data);
	};

	useEffect(() => {
		fetchChats();
	}, []);

	return (
		<div>
			{chats.map((oneChat, i) => {
				return <p key={i}>{oneChat.chatName}</p>;
			})}
		</div>
	);
};

export default Chatpage;
