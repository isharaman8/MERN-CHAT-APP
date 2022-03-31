import { ViewIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	FormControl,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);

	const toast = useToast();

	const { selectedChat, setSelectedchat, user } = ChatState();

	const handleRemove = async (user1) => {
		if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
			toast({
				title: "Only admins can remove someone!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.put(
				"http://localhost:5000/api/chat/groupremove",
				{
					chatId: selectedChat._id,
					userId: user1._id,
				},
				config
			);
			setFetchAgain(!fetchAgain);
			setLoading(false);
			user1._id === user._id ? setSelectedchat() : setSelectedchat(data);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: "Failed to load the search results" + error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
			setLoading(false);
		}
	};

	const handleAddUser = async (user1) => {
		if (selectedChat.users.find((u) => u._id === user1._id)) {
			toast({
				title: "User already exists",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: "Only admins can add someone!",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.put(
				"http://localhost:5000/api/chat/groupadd",
				{
					chatId: selectedChat._id,
					userId: user1._id,
				},
				config
			);
			setSelectedchat(data);
			setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: "Failed to load the search results" + error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});

			setLoading(false);
		}
	};

	const handleRename = async () => {
		if (!groupChatName) return;
		try {
			setRenameLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.put(
				"http://localhost:5000/api/chat/rename",
				{
					chatId: selectedChat._id,
					chatName: groupChatName,
				},
				config
			);

			setSelectedchat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setRenameLoading(false);
		}
		setGroupChatName("");
	};
	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}

		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};
			const { data } = await axios.get(
				`http://localhost:5000/api/user?search=${search}`,
				config
			);
			console.log(data);
			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: "Failed to load the search results" + error.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
			setLoading(false);
		}
	};

	return (
		<>
			<IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="35px" d="flex" justifyContent="center">
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box w="100%" d="flex" flexWrap={"wrap"} pb={3}>
							{selectedChat.users.map((u) => {
								return (
									<UserBadgeItem
										key={uuid()}
										user={u}
										handleFunction={() => handleRemove(u)}
									/>
								);
							})}
						</Box>
						<FormControl d="flex">
							<Input
								placeholder="Chat Name"
								mb="3"
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								variant="solid"
								colorScheme={"gray"}
								ml="1"
								isLoading={renameLoading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>

						<FormControl d="flex">
							<Input
								placeholder="Add User to group"
								mb="3"
								// value={groupChatName}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						{loading ? (
							<Spinner size="lg" />
						) : (
							searchResult?.map((user) => {
								return (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => handleAddUser(user)}
									/>
								);
							})
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="red" onClick={() => handleRemove(user)}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;
