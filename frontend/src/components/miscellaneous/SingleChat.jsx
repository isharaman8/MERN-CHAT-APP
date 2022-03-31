import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const { user, selectedChat, setSelectedchat } = ChatState();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState();
	const toast = useToast();

	const sendMessage = async (e) => {
		// console.log(e.key);
		if (e.key === "Enter" && newMessage) {
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
				};

				const { data } = await axios.post(
					"http://localhost:5000/api/message",
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				console.log(data);

				setNewMessage("");
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: "Error Occured",
					description: error.message,
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};

	const fetchMessages = async () => {
		if (!selectedChat) return;
		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(
				`http://localhost:5000/api/message/${selectedChat._id}`,
				config
			);

			setMessages(data);
			console.log(messages);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	useEffect(() => {
		fetchMessages();
	}, [selectedChat]);

	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		// Typing Indicator Logi
	};
	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w="100%"
						d="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
					>
						<IconButton
							d={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedchat("")}
						></IconButton>

						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModal user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
								/>
							</>
						)}
					</Text>
					<Box
						d="flex"
						flexDir={"column"}
						justifyContent="flex-end"
						p={3}
						bg="#E8E8E8"
						w="100%"
						h="100%"
						borderRadius={"lg"}
						overflowY="hidden"
					>
						{loading ? (
							<Spinner
								size="xl"
								w="20"
								h="20"
								alignSelf="center"
								margin={"auto"}
							/>
						) : (
							<div>Messages</div>
						)}
						<FormControl onKeyDown={sendMessage} isRequired mt="3">
							<Input
								variant="filled"
								bg="#ffffff"
								// color="rgb(29, 29, 29)"
								placeholder="Enter a message..."
								onChange={typingHandler}
								value={newMessage}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box d="flex" alignItems={"center"} justifyContent="center" h="100%">
					<Text fontSize={"3xl"} pb={3}>
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
