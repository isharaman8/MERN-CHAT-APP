// import { useState } from "react";
// import logo from "./logo.svg";
import "./App.scss";
// import { Button } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

function App() {
	// const [count, setCount] = useState(0);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/chat" element={<Chatpage />} />
			</Routes>
			{/* <Button colorScheme="blue">My Button</Button> */}
		</div>
	);
}

export default App;
