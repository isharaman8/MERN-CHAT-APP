import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { API } from "../../constants/api";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
	const [groupChatName, setgroupChatName] = useState();
	const [selectedUser, setselectedUser] = useState([]);
	const [search, setsearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState();
	const toast = useToast();

	const { user, chats, setChats } = ChatState();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleSearch = async (e) => {
		setsearch(e);
		if (!e) return;

		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(`${API}/api/user?search=${e}`, config);
			console.log(data);
			setLoading(false);
			setSearchResult(data);
		} catch (err) {
			toast({
				title: "Error Occured",
				description: "Failed to fetch results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};
	const handleSubmit = async () => {
		if (!groupChatName || !selectedUser) {
			toast({
				title: "Please fill all the fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.post(
				`${API}/api/chat/group`,
				{
					name: groupChatName,
					users: JSON.stringify(selectedUser.map((u) => u._id)),
				},
				config
			);

			setChats([data, ...chats]);
			onClose();

			toast({
				title: "New Group Chat Created!",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
		} catch (error) {
			toast({
				title: "Error Occured",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
		}
	};

	const handleDelete = (delUser) => {
		setselectedUser((p) => p.filter((c) => c._id !== delUser._id));
	};

	const handleGroup = (userToAdd) => {
		if (selectedUser.includes(userToAdd)) {
			toast({
				title: "User already added",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}
		setselectedUser((p) => [...p, userToAdd]);
		// console.log(selectedUser);
	};
	return (
		<>
			<div onClick={onOpen}>{children}</div>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="35px" d="flex" justifyContent={"center"}>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody d="flex" flexDir="column" alignItems="center">
						<FormControl>
							<Input
								placeholder="Chat Name"
								mb={3}
								onChange={(e) => setgroupChatName(e.target.value)}
							></Input>
						</FormControl>

						<FormControl>
							<Input
								placeholder="Add Users eg: John, Jane"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							></Input>
						</FormControl>

						<Box w="100%" d="flex" flexWrap={"wrap"}>
							{selectedUser.map((u) => {
								return (
									<UserBadgeItem
										key={user._id}
										user={u}
										handleFunction={() => handleDelete(u)}
									/>
								);
							})}
						</Box>

						{loading ? (
							<div>Loading...</div>
						) : (
							searchResult?.slice(0, 4).map((user) => {
								return (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => handleGroup(user)}
									/>
								);
							})
						)}
						{/* Render Searched Users */}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blackAlpha" onClick={handleSubmit}>
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
