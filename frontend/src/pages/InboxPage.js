// File: frontend/src/pages/InboxPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import Chat from '../components/Chat';

const InboxPage = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true); // Start loading
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        let isMounted = true; // Prevent state updates on unmounted component

        const fetchConversations = async () => {
            if (!user) {
                // Wait for user context to load
                return;
            }
            try {
                setLoading(true);
                setError(null);
                // --- THE FIX: Use correct function name ---
                const { data } = await chatService.getConversations();
                console.log("InboxPage: Fetched conversations:", data); // Debug log
                if (isMounted) {
                    setConversations(data || []); // Ensure it's always an array
                }
            } catch (err) {
                console.error("Failed to fetch conversations:", err);
                if (isMounted) {
                    setError("Could not load conversations. Please try again.");
                    setConversations([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchConversations();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [user]); // Re-fetch if user changes

    // Robust helper to find the other participant
    const getOtherParticipant = (conversation) => {
        if (!user || !conversation?.participants || !Array.isArray(conversation.participants)) {
            console.error("getOtherParticipant: Invalid input", { user, conversation });
            return null;
        }
        const other = conversation.participants.find(p => p?._id && user._id && p._id.toString() !== user._id.toString());
        // console.log(`getOtherParticipant: For convo ${conversation._id}, found other:`, other); // Optional debug log
        return other;
    };

    if (loading) {
        return <div className="text-center py-20">Loading Inbox...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500 bg-red-50 p-4">{error}</div>;
    }

    return (
        <div className="flex h-[calc(100vh-4rem)]"> {/* Full height minus header */}
            {/* Left Column: Conversation List */}
            <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
                <div className="p-4 border-b sticky top-0 bg-white z-10">
                    <h1 className="text-2xl font-bold">Inbox</h1>
                </div>
                <ul className="divide-y divide-gray-200">
                    {conversations.length > 0 ? conversations.map(convo => {
                        const otherUser = getOtherParticipant(convo);
                        if (!otherUser) return null; // Skip if participant data is invalid
                        return (
                            <li
                                key={convo._id}
                                className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedConversation?._id === convo._id ? 'bg-blue-50' : ''}`}
                                onClick={() => setSelectedConversation(convo)}
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={otherUser.profilePicture || `https://placehold.co/48x48/e2e8f0/64748b?text=${otherUser.name?.charAt(0) || '?'}`}
                                        alt={otherUser.name || 'User'}
                                        className="w-12 h-12 rounded-full bg-gray-300"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{otherUser.name || 'Unknown User'}</p>
                                        <p className="text-sm text-gray-500 truncate">Last message placeholder...</p> {/* TODO: Add last message */}
                                    </div>
                                </div>
                            </li>
                        );
                    }) : (
                        <p className="p-4 text-center text-gray-500">No conversations yet.</p>
                    )}
                </ul>
            </div>

            {/* Right Column: Active Chat Window or Placeholder */}
            <div className="w-2/3 flex flex-col bg-gray-50">
                {selectedConversation ? (
                    (() => {
                        const otherUserForChat = getOtherParticipant(selectedConversation);
                        if (!otherUserForChat) {
                             return <div className="flex-grow flex items-center justify-center"><p className="text-red-500">Error: Could not display chat.</p></div>;
                        }
                        return (
                            <Chat
                                otherUser={otherUserForChat}
                                key={selectedConversation._id} // Re-mount Chat when convo changes
                                onClose={() => {}} // No close button in inbox view
                                isInboxView={true} // Style flag for Chat component
                           />
                        );
                    })()
                ) : (
                    <div className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-700">Select a conversation</h2>
                            <p className="text-gray-500 mt-2">Choose one from the left to view messages.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxPage;