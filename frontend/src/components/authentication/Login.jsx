import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	useToast,
	VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState();
	const [show, setShow] = useState(false);
	const [password, setPassword] = useState();
	const [loading, setLoading] = useState();
	const toast = useToast();
	const navigate = useNavigate();

	const submitHandler = async () => {
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
				"http://localhost:5000/api/user/login",
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
			toast({
				title: "Error Occured",
				description: err.response.data.message,
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
					value={email}
				></Input>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeholder="Enter your Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Input>
				</InputGroup>
				<InputRightElement>
					<Button h="1.75rem" size="sm" onClick={handleClick}>
						{show ? "Hide" : "Show"}
					</Button>
				</InputRightElement>
			</FormControl>

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
					setEmail("guest@example.com");
					setPassword("123456");
				}}
			>
				Get Guest User Credentials
			</Button>
		</VStack>
	);
};

export default Login;
