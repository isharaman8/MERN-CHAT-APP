import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Signup = () => {
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [show, setShow] = useState(false);
	const [password, setPassword] = useState();
	const [pic, setPic] = useState();

	const submitHandler = () => {};

	const postDetails = (pics) => {};

	const handleClick = () => {
		setShow(!show);
	};
	return (
		<VStack spacing="5px">
			<FormControl id="first-name" isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder="Enter your name"
					onChange={(e) => setName(e.target.value)}
				></Input>
			</FormControl>
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					placeholder="Enter your Email"
					onChange={(e) => setEmail(e.target.value)}
				></Input>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeholder="Enter your Password"
						onChange={(e) => setPassword(e.target.value)}
					></Input>
				</InputGroup>
				<InputRightElement>
					<Button h="1.75rem" size="sm" onClick={handleClick}>
						{show ? "Hide" : "Show"}
					</Button>
				</InputRightElement>
			</FormControl>
			<FormControl id="confirm-password" isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup size="md">
					<Input
						type={show ? "text" : "password"}
						placeholder="Confirm Password"
						onChange={(e) => setConfirmPassword(e.target.value)}
					></Input>
				</InputGroup>
				<InputRightElement>
					<Button h="1.75rem" size="sm" onClick={handleClick}>
						{show ? "Hide" : "Show"}
					</Button>
				</InputRightElement>
			</FormControl>
			<FormControl id="pic" isRequired>
				<FormLabel>Upload your Picture</FormLabel>
				<InputGroup size="md">
					<Input
						type={"file"}
						p="1.5"
						accept="image/*"
						onChange={(e) => postDetails(e.target.files[0])}
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
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export default Signup;
