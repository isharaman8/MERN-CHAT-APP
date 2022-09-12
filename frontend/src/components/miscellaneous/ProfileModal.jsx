import { ViewIcon } from "@chakra-ui/icons";
import {
	// Button,
	IconButton,
	Modal,
	Image,
	Text,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	// ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton
					d={{ base: "flex" }}
					icon={<ViewIcon />}
					onClick={onOpen}
				></IconButton>
			)}

			<Modal size={"lg"} isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent h="400px">
					<ModalHeader>{user?.name || "Aman"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						d="flex"
						flexDir={"column"}
						alignItems="center"
						justifyContent={"space-between"}
					>
						<Image
							borderRadius={"full"}
							boxSize="140px"
							src={user.picture || user.pic}
							alt={user.name}
						/>
						<Text fontSize={"30px"} margin="20px auto">
							{user.email}
						</Text>
					</ModalBody>
					{/* <ModalFooter>
						<Button colorScheme={"blue"} mr={3} onClick={onClose}>
							Close
						</Button>
						<Button variant={"ghost"}>Secondary Action</Button>
					</ModalFooter> */}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
