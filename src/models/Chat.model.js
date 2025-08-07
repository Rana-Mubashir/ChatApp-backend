import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    isGroupChat: { type: Boolean, default: false },
    chatName: { type: String }, // Only for group chats
    groupAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
    message: { type: String, required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export { Chat, Message }
