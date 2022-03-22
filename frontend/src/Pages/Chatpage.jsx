import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
			<Link to="/">Go To Home Page</Link>
			{/* {chats.map((oneChat, i) => {
				// return <p key={i}>{oneChat.chatName}</p>;
			})} */}
		</div>
	);
};

export default Chatpage;
