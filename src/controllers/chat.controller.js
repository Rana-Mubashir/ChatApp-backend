import { Chat, Message } from "../models/Chat.model.js";

async function accessChat(req, res) {

    const { participants } = req.body

    try {

        const chat = await Chat.findOne({
            isGroupChat: false,
            participants: { $all: participants }
        })

        if (!chat) {
            const resp = await Chat.create({
                participants
            })
            if (resp) {
                return res.status(200).json({
                    chatId: resp._id,
                    messages: []
                })
            }
        }

        const messages = await Message.find({ chatId: chat._id })

        return res.status(200).json({
            chatId: chat._id,
            messages
        })

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
}

async function sendMessage(req, res) {
    try {

        const { senderId, message, chatId } = req.body

        const resp = await Message.create({ senderId, message, chatId })

        if (resp) {
            return res.status(200).json({
                message: "Message send sucessfully!",
                savedMessage: resp?.message
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
}

async function createGroup(req, res) {
    const { isGroupChat, chatName, groupAdminId, participants } = req.body;

    if (!isGroupChat || !chatName || !groupAdminId || !participants || participants.length < 2) {
        return res.status(400).json({
            message: "Invalid request. A group must have at least 2 participants and a name.",
        });
    }

    try {
        const uniqueParticipants = Array.from(new Set([...participants, groupAdminId]));

        const groupChat = await Chat.create({
            isGroupChat: true,
            chatName,
            groupAdminId,
            participants: uniqueParticipants,
        });

        return res.status(201).json({
            message: "Group created successfully.",
            groupChat,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
}

async function accessGroupChat(req, res) {
    const { userId, chatId } = req.params;

    try {
        const chat = await Chat.findOne({ _id: chatId });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const isParticipant = chat.participants.find(
            (user) => user.toString() === userId
        );

        if (!isParticipant) {
            return res.status(403).json({
                message: "You are not a member of this group",
            });
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

        return res.status(200).json({
            chatId: chat._id,
            chatName: chat.chatName,
            isGroupChat: chat.isGroupChat,
            participants: chat.participants,
            messages,
        });

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
}

async function getJoinedGroups(req, res) {
    const { userId } = req.params;

    try {
        const groups = await Chat.find({
            isGroupChat: true,
            participants: userId,
        });

        return res.status(200).json({
            message: "Fetched all joined groups",
            groups,
        });
    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
}

export { accessChat, sendMessage, createGroup, accessGroupChat,getJoinedGroups }