import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

// This custom hook's only job is to listen for the 'newMessage' event
const useListenMessages = (setMessages) => {
	const { socket } = useSocket();

	useEffect(() => {
		// If the socket is connected, start listening for new messages
		socket?.on("newMessage", (newMessage) => {
            // Add a "shake" animation for a nice UX touch
			newMessage.shouldShake = true; 
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		});

		// The cleanup function: when the component unmounts, stop listening
		// This prevents memory leaks and duplicate message handlers.
		return () => socket?.off("newMessage");
	}, [socket, setMessages]);
};

export default useListenMessages;
