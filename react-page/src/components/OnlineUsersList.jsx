import React, { useEffect } from 'react'
import { useState } from 'react';
import './OnlineUsersList.css'

export default function OnlineUsersList({ email, name, socket }) {
  //
  const [onlineUsers, setOnlineUsers] = useState([]);
  //
  useEffect(() => {
    socket.emit('start', { email, name });
  }, []);
  //
  socket.on('new_user', data => {
    const { active_users } = data;
    setOnlineUsers(active_users);
  })
  //
  const generateChat = (id) => {
    socket.emit('new_chat', { id, email })
  }
  //
  return (
    <div className='OnlineUsersList'>
      <h1 className=' IUser'>
        Usuários Online:
      </h1>
      {
        onlineUsers.map((el, index) => (<div key={index} className='IUser'> <h1>{el.name}</h1> <button className="SendButton" onClick={() => { generateChat(el.id) }}>Enviar Mensagem</button> </div>))
      }
    </div>
  )
}
