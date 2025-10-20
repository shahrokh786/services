import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import Chat from '../components/Chat'; // We will reuse our existing Chat component

const InboxPage = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await chatService.getMyConversations();
                setConversations(data);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p._id !== user._id);
    };

    if (loading) {
        return <div className="text-center py-20">Loading Inbox...</div>;
    }

    return (
        <div className="flex h-[calc(100vh-4rem)]"> {/* Full height minus header */}
            {/* Left Column: Conversation List */}
            <div className="w-1/3 border-r border-gray-200 bg-white">
                <div className="p-4 border-b">
                    <h1 className="text-2xl font-bold">Inbox</h1>
                </div>
                <ul className="divide-y divide-gray-200 overflow-y-auto">
                    {conversations.length > 0 ? conversations.map(convo => {
                        const otherUser = getOtherParticipant(convo);
                        return (
                            <li 
                                key={convo._id} 
                                className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedConversation?._id === convo._id ? 'bg-blue-50' : ''}`}
                                onClick={() => setSelectedConversation(convo)}
                            >
                                <div className="flex items-center space-x-4">
                                    <img 
                                        src={otherUser.profilePicture || `https://placehold.co/48x48/e2e8f0/64748b?text=${otherUser.name.charAt(0)}`} 
                                        alt={otherUser.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{otherUser.name}</p>
                                        <p className="text-sm text-gray-500 truncate">Last message placeholder...</p>
                                    </div>
                                </div>
                            </li>
                        );
                    }) : (
                        <p className="p-4 text-center text-gray-500">No conversations yet.</p>
                    )}
                </ul>
            </div>

            {/* Right Column: Active Chat Window */}
            <div className="w-2/3 flex flex-col">
                {selectedConversation ? (
                    <Chat 
                        otherUser={getOtherParticipant(selectedConversation)}
                        // We pass a key to force the Chat component to re-mount when the conversation changes
                        key={selectedConversation._id}
                        onClose={() => setSelectedConversation(null)} // This will be hidden in the Chat's CSS
                    />
                ) : (
                    <div className="flex-grow flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-700">Select a conversation</h2>
                            <p className="text-gray-500 mt-2">Choose a conversation from the left to start chatting.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxPage;

