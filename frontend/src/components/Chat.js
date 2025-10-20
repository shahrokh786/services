import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService'; // 1. Import our dedicated chat service
import useListenMessages from '../hooks/useListenMessages'; // 2. Import our real-time listener hook

const Chat = ({ otherUser, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    // 3. This hook handles all real-time listening for new messages from other users.
    useListenMessages(setMessages);

    // This useEffect fetches the initial chat history when the component mounts.
    useEffect(() => {
        const getMessageHistory = async () => {
            try {
                setLoading(true);
                // 4. It correctly delegates the API call to the chatService.
                const { data } = await chatService.getMessages(otherUser._id);
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch message history:", error);
            } finally {
                setLoading(false);
            }
        };
        getMessageHistory();
    }, [otherUser._id]);

    // This useEffect automatically scrolls to the bottom when new messages arrive.
    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            // 5. It correctly sends the message via an API call using our service.
            // The backend will save it and push it to the other user in real-time.
            const { data: sentMessage } = await chatService.sendMessage(otherUser._id, newMessage);
            
            // --- 6. CRITICAL FIX: THE OPTIMISTIC UI UPDATE ---
            // We immediately add the message we just successfully sent to our own chat window.
            // This solves the "disappearing message" bug.
            setMessages([...messages, sentMessage]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Could not send your message. Please try again.");
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border flex flex-col z-50 animate-fade-in-up">
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center flex-shrink-0">
                <div className="flex items-center">
                    <img src={otherUser.profilePicture || `https://placehold.co/40x40/e2e8f0/64748b?text=${otherUser.name.charAt(0)}`} alt={otherUser.name} className="w-8 h-8 rounded-full mr-3"/>
                    <span className="font-semibold">{otherUser.name}</span>
                </div>
                <button onClick={onClose} className="text-2xl leading-none hover:text-gray-200">&times;</button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading && <p className="text-center text-gray-500">Loading chat history...</p>}
                {messages.map((message) => (
                    <div key={message._id} className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.senderId === user._id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p className="text-sm">{message.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t bg-gray-50 rounded-b-lg">
                <div className="flex space-x-2">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-all">Send</button>
                </div>
            </form>
        </div>
    );
};

export default Chat;

