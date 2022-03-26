import {
	Avatar,
	Box,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const SideDrawer = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState();

	const { user } = ChatState();

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
					<Button variant={"ghost"}>
						<i className="material-icons">search</i>
						<Text d={{ base: "none", md: "flex" }} px="4">
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize={"2xl"}>MERN-CHAT-APP</Text>
				<div>
					<Menu>
						<MenuButton p="1">
							<i
								style={{ fontSize: "25px", margin: "1px" }}
								className="material-icons"
							>
								notifications
							</i>
						</MenuButton>
						{/* <MenuList></MenuList> */}
					</Menu>
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
							<MenuItem>My Profile</MenuItem>
							<MenuItem>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>
		</>
	);
};

export default SideDrawer;
