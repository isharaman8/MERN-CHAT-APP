import {
	Button,
	FormControl,
	FormLabel,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../constants/api";

const Login = () => {
	const [email, setEmail] = useState();
	const [show, setShow] = useState(false);
	const [password, setPassword] = useState();
	const [loading, setLoading] = useState();
	const [openReset, setOpenReset] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();

	// Refs for Email and Password
	const emailRef = useRef();
	const passwordRef = useRef();

	const openResetPassword = () => setOpenReset(true);
	const closeResetPassword = () => setOpenReset(false);

	const handleResetPasswordLink = async () => {};

	const submitHandler = async () => {
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		setLoading(true);
		if (!email || !password) {
			toast({
				title: "Please fill all the fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			const { data } = await axios.post(
				`${API}/api/user/login`,
				{ email, password },
				config
			);

			if (email === "guest@example.com") {
				toast({
					title: "Logged in as Guest User",
					status: "info",
					duration: 5000,
					isClosable: true,
					position: "top",
				});
			} else {
				toast({
					title: "Login Successful",
					status: "success",
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
			}

			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			navigate("/chat");
		} catch (err) {
			console.log(err);
			toast({
				title: "Error Occured",
				description: err?.response?.data?.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	const handleClick = () => {
		setShow(!show);
	};

	return (
		<VStack spacing="5px">
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					placeholder="Enter your Email"
					onChange={(e) => setEmail(e.target.value)}
					ref={emailRef}
				/>
			</FormControl>

			{!openReset && (
				<FormControl id="password" isRequired>
					<FormLabel>Password</FormLabel>
					<InputGroup>
						<Input
							type={show ? "text" : "password"}
							placeholder="Enter your Password"
							ref={passwordRef}
							// value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</InputGroup>
					<InputRightElement>
						<Button h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</FormControl>
			)}
			{!openReset && (
				<HStack
					width={"100%"}
					justifyContent="space-between"
					alignItems={"center"}
					pt={2}
				>
					<Text fontSize={15}>Forgot Password?</Text>
					<Text
						sx={{
							fontSize: 15,
							color: "blue",
							"&:hover": {
								cursor: "pointer",
								textDecoration: "underline",
							},
						}}
						onClick={openResetPassword}
					>
						Reset
					</Text>
				</HStack>
			)}
			{!openReset ? (
				<VStack width={"100%"}>
					<Button
						colorScheme={"blackAlpha"}
						width="100%"
						style={{ marginTop: 15 }}
						onClick={submitHandler}
						isLoading={loading}
					>
						Login
					</Button>
					<Button
						variant={"solid"}
						colorScheme="red"
						width="100%"
						onClick={() => {
							emailRef.current.value = "guest@example.com";
							passwordRef.current.value = "123456";
						}}
					>
						Get Guest User Credentials
					</Button>
				</VStack>
			) : (
				<VStack sx={{ width: "100%" }}>
					<Button
						width="100%"
						colorScheme={"blue"}
						onClick={handleResetPasswordLink}
					>
						Send Link
					</Button>
					<Button
						width="100%"
						colorScheme={"orange"}
						onClick={closeResetPassword}
					>
						Back
					</Button>
				</VStack>
			)}
		</VStack>
	);
};

export default Login;
