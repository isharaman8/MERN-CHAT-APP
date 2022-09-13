import React, { useState } from "react";
import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { API } from "../constants/api";
import axios from "axios";

const ForgotPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [buttonLoading, setButtonLoading] = useState(false);

	const params = useParams();
	const navigate = useNavigate();
	const { id } = params;

	const handleChangePassword = (event) => setPassword(event.target.value);
	const handleChangeConfirmPassword = (event) =>
		setConfirmPassword(event.target.value);

	useEffect(() => {
		if (!id || id == "undefined") return navigate("/");
	}, []);

	const handleResetPassword = async () => {
		const API_URL = `${API}/api/user/login/setnewpassword`;
		setButtonLoading(true);
		try {
			if (!confirmPassword || !password)
				throw new Error("Please provide all the details");
			if (confirmPassword !== password)
				throw new Error("Passwords do not match");

			const data = await axios.patch(API_URL, { password, id });

			if (data.data && data.data._id) {
				alert("Password changed successfully");
				navigate("/");
			}

			console.log(data);
		} catch (error) {
			console.log(error);
			alert(error.message);
		} finally {
			setButtonLoading(false);
		}
	};

	return (
		<Box
			sx={{
				width: "100vw",
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<VStack
				sx={{
					backgroundColor: "white",
					padding: 5,
					borderRadius: 5,
					minWidth: 400,
				}}
				spacing={5}
			>
				<Text fontSize={30} textAlign={"left"} width={"100%"}>
					Set New Password
				</Text>
				<Input
					value={password}
					type={"password"}
					onChange={handleChangePassword}
					placeholder="Password"
				/>
				<Input
					value={confirmPassword}
					type={"password"}
					onChange={handleChangeConfirmPassword}
					placeholder="Confirm Password"
				/>
				<Button
					isLoading={buttonLoading}
					colorScheme={"facebook"}
					width={"100%"}
					onClick={handleResetPassword}
				>
					Set
				</Button>
				<Button
					colorScheme={"red"}
					width={"100%"}
					onClick={() => navigate("/")}
				>
					Back
				</Button>
			</VStack>
		</Box>
	);
};

export default ForgotPassword;
