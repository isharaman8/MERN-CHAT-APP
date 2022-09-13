import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
	const [user, setUser] = useState();
	const [selectedChat, setSelectedchat] = useState();
	const [chats, setChats] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		setUser(userInfo);
		if (
			!userInfo &&
			location.pathname.startsWith("/resetpassword/") === false
		) {
			navigate("/");
		}
	}, [navigate]);

	return (
		<ChatContext.Provider
			value={{
				user,
				setUser,
				setSelectedchat,
				selectedChat,
				chats,
				setChats,
				notifications,
				setNotifications,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const ChatState = () => {
	return useContext(ChatContext);
};
