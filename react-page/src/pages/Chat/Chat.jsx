import './Chat.css'
import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client'
import OnlineUsersList from '../../components/OnlineUsersList'
import MyChats from '../../components/MyChats'


const token = JSON.parse(localStorage.getItem('token'))
const socket_url = "ws://localhost:3010/";

const socket = io(socket_url, {
  transports: ["websocket"],
  auth: { token }
});

export default function Chat() {
  const email = JSON.parse(localStorage.getItem('email'))
  const name = JSON.parse(localStorage.getItem('name'))
  const Nav = useNavigate();

  useEffect(() => {
    if (!socket.active) {
      const token = JSON.parse(localStorage.getItem('token'))
      socket.auth = { token }
      socket.connect();
    }
  }, [])
  //
  const disconect = () => {
    if (socket.connected) socket.disconnect();
    localStorage.clear();
    Nav("/login")
  }


  return (<div className='Chat'>

    <OnlineUsersList socket={socket} name={name} email={email}></OnlineUsersList>
    <MyChats socket={socket} name={name} email={email}></MyChats>
    <button id='LogoutButton' onClick={disconect}>Logout</button>

  </div>)
}
