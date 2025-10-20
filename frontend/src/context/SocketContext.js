import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { user } = useAuth(); // Get the logged-in user from our AuthContext

	useEffect(() => {
		// This effect runs whenever the 'user' state changes (i.e., on login/logout)
		if (user) {
			// If a user is logged in, create a new socket connection.
			const newSocket = io("http://localhost:5000", { // Connect directly to our backend URL
				query: {
					userId: user._id, // CRITICAL FIX: Use user._id
				},
			});

			setSocket(newSocket);

			// Listen for the 'getOnlineUsers' event from the backend.
			// This gives us a live list of who is currently online.
			newSocket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// The cleanup function: this runs when the component unmounts or the user logs out.
			return () => newSocket.close();
		} else {
			// If there is no user, make sure any existing socket is disconnected.
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [user]); // The dependency array ensures this effect re-runs on login/logout

	return (
        // Provide both the socket connection and the list of online users to the entire app.
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
