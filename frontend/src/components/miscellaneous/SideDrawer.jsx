import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	// Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import React, { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	// const [selectedChat, setSelectedChat] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { user, setSelectedchat, chats, setChats } = ChatState();
	// console.log(user);

	const logoutHandler = () => {
		localStorage.removeItem("userInfo");
		navigate("/");
	};

	const toast = useToast();

	const handleSearch = async () => {
		if (!search) {
			toast({
				title: "Please Enter something in return",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top-left",
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
			const { data } = await axios.get(
				`http://localhost:5000/api/user?search=${search}`,
				config
			);
			setLoading(false);
			setSearchResult(data);
		} catch (err) {
			toast({
				title: "Error occured",
				description: "Failed to load the search results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});

			setLoading(false);
		}
	};
	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post(
				"http://localhost:5000/api/chat",
				{ userId },
				config
			);

			// if (!chats.find((c) => c._id === data._id))
			// 	setSelectedchat([data, ...chats]);

			setLoadingChat(false);
			setSelectedchat(data);
			// console.log(data);
		} catch (error) {
			toast({
				title: "Error fetching the chat",
				description: error.message,
				duration: 5000,
				status: "error",
				isClosable: true,
				position: "bottom-left",
			});
		}
	};
	return (
		<>
			<Box
				d="flex"
				justifyContent={"space-between"}
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px"
				borderWidth={"5px"}
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
					<Button variant={"ghost"} onClick={onOpen}>
						<i className="material-icons">search</i>
						<Text d={{ base: "none", md: "flex" }} px="4">
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize={"2xl"}>MERN-CHAT-APP</Text>
				<div>
					<Menu>
						<MenuButton>
							{/* <i className="material-icons">notifications</i> */}
							<SearchIcon style={{ fontSize: "20px", marginRight: "10px" }} />
						</MenuButton>
						{/* <MenuList></MenuList> */}
					</Menu>
					{/* <MenuDivider /> */}
					<Menu>
						<MenuButton
							as={Button}
							rightIcon={<i className="material-icons">expand_more</i>}
						>
							<Avatar
								size="sm"
								cursor={"pointer"}
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
								<MenuDivider />
								<MenuItem onClick={logoutHandler}>Logout</MenuItem>
							</ProfileModal>
						</MenuList>
					</Menu>
				</div>
			</Box>
			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
					<DrawerBody>
						<Box d="flex" p="2">
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={handleSearch}>Go</Button>
						</Box>

						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((user) => {
								return (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => accessChat(user._id)}
									/>
								);
							})
						)}
						{loadingChat && <Spinner ml="auto" d="flex" />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
