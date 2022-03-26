import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const MyChats = () => {
	const [loggedUser, setloggedUser] = useState();
	const { selectedChat, setSelectedchat, user, chats, setChats } = ChatState();

	const toast = useToast();

	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get(
				"http://localhost:5000/api/chat",
				config
			);
			setChats(data);
		} catch (err) {
			// console.log(
			toast({
				title: "Error occured",
				description: err.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	useEffect(() => {
		setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
		fetchChats();
	}, []);

	return <div>MyChats</div>;
};

export default MyChats;
