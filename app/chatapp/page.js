"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
import { IoMdSend } from "react-icons/io";
import style from "../body.module.css";
const socket = io("http://localhost:4000", { reconnection: true });
function Chatapp() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [onlineUser, setOnlineUser] = useState(1);
  const [oldMessages,setOldMessage] = useState([]);
  const[showoldmessage,setshowoldmessage]= useState(false);

  useEffect(() => {
    async function getMessage() {
      const res = await fetch("/api/message");
      const data = await res.json();
      setOldMessage(data.message);
    }
    getMessage();
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setName(username);

    if (!username) {
      setTimeout(() => {
        router.push("/login");
      }, 500);
      return;
    }

    socket.emit("userJoined", username);

    socket.on("userCount", (count) => setOnlineUser(count));

    socket.on("newUser", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          name: "System",
          message: `${data.username} joined the chat.`,
          time: new Date().toLocaleTimeString(),
          type: "join",
        },
      ]);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, { ...msg, type: "message" }]);
    });

    socket.on("userLeft", (username) => {
      setMessages((prev) => [
        ...prev,
        {
          name: "System",
          message: `${username} left the chat.`,
          time: new Date().toLocaleTimeString(),
          type: "leave",
        },
      ]);
    });

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("message");
      socket.off("userCount");
      socket.off("newUser");
      socket.off("userLeft");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [name]);
  
  useEffect(() => {
    const chatArea = document.querySelector(`.${style.chatArea}`);
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        name: name || "Unknown User",
        message: message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("message", msgData);
      setMessage("");
    }
  };

  function handleprevMsg(){
    setshowoldmessage(prev=>!prev);
  }

  return (
    <>
      {name && (
        <div className={`${style.chatBord}`}>
          <h1
            className={`text-start text-4xl pl-2  font-semibold capitalize text-wrap ${style.heading}`}
          >
            Welcome, {name} <span>Let' Chat</span>
          </h1>
          <div className={`m-2 flex flex-col ${style.chatbox}`}>
           <div className="flex justify-between">
            <h2 className="text-right pr-2 pb-2 pt-2">
               People in the Chat: {onlineUser}
            </h2>
           <button onClick={handleprevMsg} className={`${style.LoginButton} pl-2 pr-2 rounded-lg`}> 
           {showoldmessage?"hide conversation":"previous conversation"} </button>
           </div>
            <div
              className={`border p-4 mb-4 h-64 overflow-y-auto ${style.chatArea}`}
            >
              {showoldmessage?oldMessages?oldMessages.map((msg,index)=>{
                return (<>
                <p
                  key={index}
                  className={`mb-2 ${
                    msg.type === "join"
                      ? "text-green-500"
                      : msg.type === "leave"
                      ? "text-red-300"
                      : "text-black"
                  } text-wrap`}
                >
                  <strong className="capitalize pl-2 underline text-xl  text-gray-900">
                    {msg.SenderName}
                  </strong>{" "}
                  <span className="text-wrap pl-4 pr-3 text-lg font-semibold  text-gray-500">
                    {msg.message}{" "}
                  </span>
                  <span className="text-sm text-wrap  text-gray-800">
                    {moment(msg.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</span>
                </p>
                </>)
              }):"no previous chats":""}
              {messages.map((msg, index) => (
                <p
                  key={index}
                  className={`mb-2 ${
                    msg.type === "join"
                      ? "text-green-500"
                      : msg.type === "leave"
                      ? "text-red-500"
                      : "text-black"
                  } text-wrap`}
                >
                  <strong className="capitalize pl-2 underline text-xl">
                    {msg.name}
                  </strong>{" "}
                  <span className="text-wrap text-lg pl-2 pr-3 font-semibold text-white">
                    {msg.message}{" "}
                  </span>
                  <span className="text-sm text-wrap text-gray-400">{msg.time}</span>
                </p>
              ))}
            </div>
            <div className="flex items-center p-1 gap-1">
              <input
                className={`${style.sendchatInput}`}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
              />
              <button
                className="text-xl bg-blue-500 text-white pt-3 pb-3 pl-4 pr-4 rounded-sm"
                onClick={sendMessage}
              >
                <IoMdSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatapp;
