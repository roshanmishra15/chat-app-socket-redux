import Message from "../models/Message.js";

export const getGlobalMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatType: "global" }).populate("sender", "fullname email").sort({ createdAt: 1 });
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ message: "Error fetching global Messages" });
    }
}

export const getPrivateMessages = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user.userId;

        const messages = await Message.find({
            chatType: "private",
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        },

        ).populate("sender", "fullname email")
            .populate("receiver", "fullname email")
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Private Messages" });
    }
}

export const getRecentMessages = async (req, res) => {
    try {
        const currentUserId = req.user.userId;

        const messages = await Message.find({
            chatType: "private",
            $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        })
            .sort({ createdAt: -1 })
            .populate("sender", "fullname email")
            .populate("receiver", "fullname email");

        const chatMap = new Map();

        for (let msg of messages) {
            const otherUser =
                msg.sender._id.toString() === currentUserId
                    ? msg.receiver
                    : msg.sender;

            if (!chatMap.has(otherUser._id.toString())) {
                chatMap.set(otherUser._id.toString(), {
                    user: otherUser,
                    lastMessage: msg,
                });
            }
        }

        return res.status(200).json(Array.from(chatMap.values()));
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
