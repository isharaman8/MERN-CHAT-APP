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
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);

	const toast = useToast();

	const { selectedChat, setSelectedchat, user } = ChatState();

	const handleRemove = () => {};

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
	const handleSearch = () => {};

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
