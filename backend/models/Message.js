import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.chatType === "private";
      },
    },

    chatType: {
      type: String,
      enum: ["private", "global", "room"],
      required: true,
    },

    // ✅ TEXT MESSAGE
    content: {
      type: String,
      default: "",
      trim: true,
    },

    // ✅ FILE MESSAGE
    file: {
      url: { type: String, default: "" },
      fileName: { type: String, default: "" },
      fileType: { type: String, default: "" }, // image/pdf/docx
    },

    messageType: {
      type: String,
      enum: ["text", "file"],
      default: "text",
    },

    delivered: {
      type: Boolean,
      default: false,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
