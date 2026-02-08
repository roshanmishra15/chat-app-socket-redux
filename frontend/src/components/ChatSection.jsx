import React from "react";
import { useSelector } from "react-redux";
import GlobalChat from "./GlobalChat";
import PrivateChat from "./PrivateChat";

function ChatSection() {
  const mode = useSelector((state) => state.chat.mode);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {mode === "global" ? <GlobalChat /> : <PrivateChat />}
    </div>
  );
}

export default ChatSection;
