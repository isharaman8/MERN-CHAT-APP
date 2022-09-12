import React, { useEffect } from "react";
import {
	Box,
	Container,
	Tabs,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Text,
} from "@chakra-ui/react";
import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("userInfo"));
		if (user) navigate("/");
	}, [navigate]);

	return (
		<Container maxW="xl" centerContent>
			<Box
				d="flex"
				justifyContent={"center"}
				p={3}
				bg={"white"}
				w="100%"
				m="40px 0 15px 0"
				borderRadius={"lg"}
				borderWidth={"1px"}
			>
				<Text fontSize={"4xl"} color="grey">
					Chat App
				</Text>
			</Box>
			<Box
				bg="white"
				w="100%"
				p={4}
				borderRadius="lg"
				color={"rgb(29, 29, 29)"}
				borderWidth={"1px"}
			>
				<Tabs variant={"soft-rounded"} colorScheme={"blackAlpha"}>
					<TabList mb={"1em"}>
						<Tab width={"50%"}>Login</Tab>
						<Tab width={"50%"}>Sign Up</Tab>
					</TabList>

					<TabPanels>
						<TabPanel>
							{/* <p>one!</p> */}
							<Login />
						</TabPanel>
						<TabPanel>
							{/* <p>two!</p> */}
							<Signup />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default Homepage;
