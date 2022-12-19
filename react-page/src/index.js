import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat.jsx";

export const url = "http://localhost:3010/";
export const objectModel = {
  parts: {
    dest_name: "",
    dest_email: "",
    reme_name: "",
    reme_email: "",
  },
  chat_id: "",
  chat_messages: [""],
  _id: "",
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/chat" element={<Chat />} />
    </Routes>
  </BrowserRouter>
);
