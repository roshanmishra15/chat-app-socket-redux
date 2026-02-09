import socketAuth from "../middlewares/socketAuth.js";
import Message from "../models/Message.js";

const onlineUsers = new Map();
const userSocketMap = new Map(); // userId -> socketId

const initSocket = (io) => {
  io.use(socketAuth);

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();

    userSocketMap.set(userId, socket.id);

    onlineUsers.set(userId, {
      _id: socket.user._id,
      fullname: socket.user.fullname,
      email: socket.user.email,
    });

    // ✅ SEND ONLINE USERS
    io.emit("online-users", Array.from(onlineUsers.values()));

    // ✅ SEND OLD GLOBAL MESSAGES
    const oldMessages = await Message.find({ chatType: "global" })
      .populate("sender", "fullname email")
      .sort({ createdAt: 1 });

    socket.emit("global-messages", oldMessages);

    // ✅ GLOBAL MESSAGE
    socket.on("send-global-message", async ({ content }) => {
      try {
        if (!content) return;

        const msg = await Message.create({
          sender: userId,
          chatType: "global",
          content,
        });

        const populateMsg = await Message.findById(msg._id).populate(
          "sender",
          "fullname email"
        );

        io.emit("new-global-message", populateMsg);
      } catch (error) {
        console.log("Global message error:", error.message);
      }
    });

    // ✅ PRIVATE MESSAGE (Sent + Delivered)
    socket.on(
      "send-private-message",
      async ({ receiverId, content, messageType, fileType, fileName }) => {
        try {
          if (!receiverId || !content) return;

          const receiverSocketId = userSocketMap.get(receiverId);

          const msg = await Message.create({
            sender: userId,
            receiver: receiverId,
            chatType: "private",
            content,

            // ✅ important
            messageType: messageType || "text",
            fileType: fileType || null,
            fileName: fileName || null,

            delivered: receiverSocketId ? true : false,
            read: false,
          });

          const populatedMsg = await Message.findById(msg._id)
            .populate("sender", "fullname email")
            .populate("receiver", "fullname email");

          if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-private-message", populatedMsg);
          }

          socket.emit("new-private-message", populatedMsg);
        } catch (error) {
          console.log("Private Message Error:", error.message);
        }
      }
    );


    // ✅ MARK AS DELIVERED (receiver opens chat list / chat)
    socket.on("mark-as-delivered", async ({ senderId }) => {
      try {
        await Message.updateMany(
          {
            sender: senderId,
            receiver: userId,
            chatType: "private",
            delivered: false,
          },
          { $set: { delivered: true } }
        );

        const senderSocketId = userSocketMap.get(senderId);

        if (senderSocketId) {
          io.to(senderSocketId).emit("messages-delivered", {
            receiverId: userId, // who received
          });
        }


      } catch (error) {
        console.log("Mark as delivered error:", error.message);
      }
    });

    socket.on("mark-as-read", async ({ senderId }) => {
      try {
        const msgs = await Message.find({
          sender: senderId,
          receiver: userId,
          chatType: "private",
          read: false,
        });

        const ids = msgs.map((m) => m._id);

        await Message.updateMany(
          { _id: { $in: ids } },
          { $set: { read: true, delivered: true } }
        );

        const senderSocketId = userSocketMap.get(senderId);

        if (senderSocketId) {
          io.to(senderSocketId).emit("messages-read", {
            readerId: userId,
            messageIds: ids,
          });
        }
      } catch (error) {
        console.log("Mark as read error:", error.message);
      }
    });



    // ✅ TYPING INDICATOR
    socket.on("typing", ({ receiverId }) => {
      const receiverSocketId = userSocketMap.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", {
          senderId: userId,
        });
      }
    });

    socket.on("stop-typing", ({ receiverId }) => {
      const receiverSocketId = userSocketMap.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-stop-typing", {
          senderId: userId,
        });
      }
    });

    console.log("🟢 Socket connected:", socket.user.fullname);

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.user.fullname);

      onlineUsers.delete(userId);
      userSocketMap.delete(userId);

      io.emit("online-users", Array.from(onlineUsers.values()));
    });
  });
};

export default initSocket;
