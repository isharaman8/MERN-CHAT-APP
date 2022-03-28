import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [user, setUser] = useState();
	const [selectedChat, setSelectedchat] = useState();
	const [chats, setChats] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		setUser(userInfo);
		if (!userInfo) {
			navigate("/");
		}
	}, [navigate]);

	return (
		<ChatContext.Provider
			value={{ user, setUser, setSelectedchat, selectedChat, chats, setChats }}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const ChatState = () => {
	return useContext(ChatContext);
};
