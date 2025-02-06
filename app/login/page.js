"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import style from "../body.module.css";
import { TextField, Button } from "@mui/material";
function Login() {
  const router = useRouter();
  const [name, setName] = useState("");

  function handleChatClick() {
    if (!name) {
      alert("Please enter your name before starting the chat.");
      return;
    }
    localStorage.setItem("username", name);
    router.push("/chatapp");
  }
  return (
    <>
    <div className="h-screen bg-blue-950 flex  flex-col justify-center items-center">
      <div className="flex flex-col mb-4 text-pretty p-5" style={{width:"100%"}}>
        <p className="capitalize text-4xl pt-4 pb-5 text-white font-semibold text-center w-full block mb-4">Chat with Friends in Real-Time</p>
        <h1 className="capitalize text-white font-semibold  text-center text-2xl mb-5 text-wrap">Welcome to 
          <span className="text-4xl font-bold text-blue-500 pl-2"> REAL TIME CHAT APPLICATION</span> Join the Conversation!
        </h1>
          <h1 className="text-2xl text-center text-white font-semibold mb-5">Enter your username and join the chat instantly</h1>
      </div>
      <TextField
        type="text"
        className={`w-fit  rounded-lg outline-none border-none mb-5 ${style.loginInpuut}`}
        value={name}
        color="black"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        label="Name"
        required
        sx={{
          border: "1px solid white",
          background: "white",
          "&:hover fieldset": {
            border: "none",
          },
          ":hover": {
            border: "none",
            outline: "none",
          },
          ":active": {
            border: "none",
            outline: "none",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "white", 
            fontSize:"1.2rem",
            top:"-12px",
            fontWeight:"600"
          }
        }}
      />
      <Button
        variant="contained"
        className={`capitalize p-3 rounded-lg ${style.LoginButton}`}
        onClick={handleChatClick}
      >
        Let's Start the Chat
      </Button>

      <div className="flex flex-col">
        <h1 className="flex text-4xl mt-6 pl-2 font-thin" style={{color:"skyblue",fontFamily:"serif",textShadow:"2px 1px 2px grey"}}>Connect with others, make new friends, and have fun!</h1>
      </div>
    </div>
    </>
  );
}

export default Login;
