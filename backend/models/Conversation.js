import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    // An array containing the user IDs of the two participants
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    // An array containing all the messages in this conversation
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: [],
        },
    ],
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
