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

    content: {
      type: String,
      required: true,
      trim: true,
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
