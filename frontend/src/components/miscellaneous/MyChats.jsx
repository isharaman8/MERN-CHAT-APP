import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
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

	// useEffect(() => {
	// 	// console.log(selectedChat);
	// }, [selectedChat]);

	// const getSender = () => {}

	useEffect(() => {
		setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
		fetchChats();
		// console.log(chats);
	}, [fetchAgain]);

	return (
		<Box
			d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
			flexDir="column"
			alignItems={"center"}
			p={3}
			bg="white"
			w={{ base: "100%", md: "31%" }}
			borderRadius="lg"
			borderWidth={"1px"}
		>
			<Box
				pb="3"
				px="3"
				fontSize={{ base: "28px", md: " 30px" }}
				d="flex"
				w="100%"
				justifyContent={"space-between"}
				alignItems="center"
			>
				My Chats
				<GroupChatModal>
					<Button
						d="flex"
						fontSize={{ base: "17px", md: "10px", lg: "17px" }}
						rightIcon={<AddIcon />}
					>
						New Group Chat
					</Button>
				</GroupChatModal>
			</Box>
			<Box
				d="flex"
				flexDir={"column"}
				p={3}
				bg="#F8F8F8"
				w="100%"
				h="100%"
				borderRadius={"lg"}
				overflowY="hidden"
			>
				{chats.length > 0 ? (
					<Stack overflowY={"scroll"} style={{ scrollbarWidth: "none" }}>
						{chats.map((chat) => {
							return (
								<Box
									onClick={() => {
										setSelectedchat(chat);
									}}
									cursor="pointer"
									background={
										selectedChat?._id === chat?._id ? "#38B2AC" : "#ffffff"
									}
									color={selectedChat === chat ? "white" : "black"}
									px="3"
									py="2"
									borderRadius={"lg"}
									key={chat._id}
								>
									{!chat.isGroupChat
										? getSender(loggedUser, chat.users)
										: chat.chatName}
								</Box>
							);
						})}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
