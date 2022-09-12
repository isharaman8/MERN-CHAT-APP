import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
	useToast,
	IconButton,
	Avatar,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API, CLOUDINARY_API } from "../../constants/api";
import { useRef } from "react";

const Signup = () => {
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [show, setShow] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [password, setPassword] = useState();
	const [pic, setPic] = useState();
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const hiddenInputRef = useRef(null);
	const navigate = useNavigate();

	const submitHandler = async () => {
		setLoading(true);
		if (!name || !email || !password || !confirmPassword || !pic) {
			toast({
				title: "Please Fill all the Fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			// .catch((err) => console.log(err))
			// .finally(() => setLoading(false));
			setLoading(false);
			return;
		}
		if (password !== confirmPassword) {
			toast({
				title: "Password Do Not Match",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
				// }).catch((err) => console.log(err));
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
				`${API}/api/user`,
				{ name, email, password, pic },
				config
			);
			toast({
				title: "Registration Successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			navigate("/chat");
		} catch (err) {
			toast({
				title: "Error occured!",
				description: err.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			console.log(err);
		}
	};

	const postDetails = (pics) => {
		setLoading(true);
		if (pics === undefined) {
			{
				toast({
					title: "Please Select an Image!",
					status: "warning",
					isClosable: true,
					position: "bottom",
					duration: 5000,
				});
				return;
			}
		}
		if (pics.type === "image/jpeg" || pics.type === "image/png") {
			const data = new FormData();
			data.append("file", pics);
			data.append("upload_preset", "Chat app");
			data.append("cloud_name", "chat-app-11118");
			fetch(CLOUDINARY_API, {
				method: "POST",
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					setPic(data.url.toString());
					console.log(data.url.toString());
				})
				.catch((err) => console.log(err))
				.finally(() => setLoading(false));
		} else {
			toast({
				title: "Please select an Image!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	const toggleShowPassword = () => setShow(!show);

	const toggleShowConfirmPassword = () =>
		setShowConfirm((p) => (p ? false : true));
	return (
		<VStack spacing="5px">
			<FormControl id="pic" isRequired>
				<InputGroup
					size="md"
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						minHeight: "fit-content",
						minWidth: "fit-content",
					}}
				>
					<Input
						type={"file"}
						p="1.5"
						accept="image/*"
						ref={hiddenInputRef}
						sx={{ display: "none" }}
						onChange={(e) => postDetails(e.target.files[0])}
					/>
					<IconButton
						onClick={() => hiddenInputRef.current.click()}
						sx={{
							weight: "fit-content",
							height: "fit-content",
							backgroundColor: "transparent",
							"&:hover": {
								backgroundColor: "transparent",
								boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
								borderRadius: "50%",
							},
						}}
					>
						<Avatar
							src={pic || ""}
							alt={name || "Image"}
							sx={{ width: 100, height: 100 }}
						/>
					</IconButton>
				</InputGroup>
			</FormControl>
			<FormControl id="first-name" isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder="Enter your name"
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>
			<FormControl id="email" isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					placeholder="Enter your Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeholder="Enter your Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</InputGroup>
				<InputRightElement>
					<Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
						{show ? "Hide" : "Show"}
					</Button>
				</InputRightElement>
			</FormControl>
			<FormControl id="confirm-password" isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup size="md">
					<Input
						type={showConfirm ? "text" : "password"}
						placeholder="Confirm Password"
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</InputGroup>
				<InputRightElement>
					<Button h="1.75rem" size="sm" onClick={toggleShowConfirmPassword}>
						{showConfirm ? "Hide" : "Show"}
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
				Sign Up
			</Button>
		</VStack>
	);
};

export default Signup;
