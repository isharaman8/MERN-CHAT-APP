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
import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Lottie from "react-lottie";
import io from "socket.io-client";
import axios from "axios";

import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import animationData from "../../animations/typinganimation.json";
import { API } from "../../constants/api";

const ENDPOINT = API;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const {
		user,
		selectedChat,
		setSelectedchat,
		notifications,
		setNotifications,
	} = ChatState();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState();
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const inputRef = useRef();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	const toast = useToast();

	const sendMessage = async (e) => {
		if (e.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				const config = {
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
				};

				const { data } = await axios.post(
					`${API}/api/message`,
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				socket.emit("new message", data);

				setNewMessage("");
				inputRef.current.value = "";
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
				`${API}/api/message/${selectedChat._id}`,
				config
			);

			setMessages(data);
			socket.emit("join chat", selectedChat._id);
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
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
	}, []);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	useEffect(() => {
		socket.on("message received", (newMessage) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessage.chat._id
			) {
				// give notification
				if (!notifications.includes(newMessage)) {
					setNotifications([newMessage, ...notifications]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessage]);
			}
		});
	});

	const typingHandler = (e) => {
		setNewMessage(e.target.value);
		// Typing Indicator Logi
		if (!socketConnected) return;
		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}

		let lastTypingTime = new Date().getTime();
		var timerLength = 3000;

		setTimeout(() => {
			var timeNow = new Date().getTime();
			var timeDiff = timeNow - lastTypingTime;

			if (timeDiff >= timerLength && typing) {
				socket.emit("stop typing", selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
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
									fetchMessages={fetchMessages}
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
							<div className="messages">
								<ScrollableChat messages={messages} />
							</div>
						)}
						<FormControl onKeyDown={sendMessage} isRequired mt="3">
							{isTyping ? (
								<div>
									<Lottie
										width={70}
										style={{ marginBottom: 15, marginLeft: 0 }}
										options={defaultOptions}
									/>
								</div>
							) : (
								<></>
							)}
							<Input
								variant="filled"
								bg="#ffffff"
								// color="rgb(29, 29, 29)"
								placeholder="Enter a message..."
								onChange={typingHandler}
								ref={inputRef}
								// value={newMessage}
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
