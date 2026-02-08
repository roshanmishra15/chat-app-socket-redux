import React from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import ChatSection from "./ChatSection.jsx";

function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <ChatSection />
      </div>
    </div>
  );
}

export default Home;
