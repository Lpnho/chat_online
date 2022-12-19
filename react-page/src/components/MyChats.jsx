import React, { useEffect } from 'react'
import { useState } from 'react'
import CurrentChat from './CurrentChat'
import "./MyChats.css"

// const storageChats = JSON.parse(localStorage.getItem('chats'));

export default function MyChats({ socket, email, name }) {
  //
  const [chats, setChats] = useState([])                    //Chats do Usuário
  const [currentChat, setCurrentChat] = useState('')        //Chat Corrente
  const [messages, setMessages] = useState([''])            //Mensagens
  const [currentReme, setCurrentReme] = useState('')
  const [message, setMessage] = useState('')                //Mensagem para envio 


  //
  useEffect(() => {
    let _chats = JSON.parse(localStorage.getItem('chats'))
    setChats(_chats)
  }, [])
  //
  socket.on('new_chat_', (data) => {
    const { chat_id } = data;
    let _chats = JSON.parse(localStorage.getItem('chats'))
    let exist = _chats.find((el) => el.chat_id === chat_id)

    if (!exist) _chats.push(data)

    localStorage.setItem('chats', JSON.stringify(_chats))
    setChats(prev => _chats);
  })
  //
  socket.on("mensage", (data) => {

    const { chat, chat_messages } = data
    let _chats = JSON.parse(localStorage.getItem("chats"));
    _chats.forEach(element => {
      if (element.chat_id === chat) {
        element.chat_messages = chat_messages;
        if (currentChat === chat) {
          localStorage.setItem('chats', JSON.stringify(_chats))
          setMessages(chat_messages)

        }
      }
    });
  })
  //
  const generateChatName = (arg) => {
    const { dest_email, dest_name, reme_name } = arg
    return ((dest_email === email) ? reme_name : dest_name)
  }
  //
  const sendMessage = () => {
    if (message && message !== "") {
      socket.emit("mensage", { msg: email + '#{?/' + message, chat: currentChat })
      setMessage("");
    }
  }
  //
  const sendMessageByEnter = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
      e.preventDefault()
    }
  }
  //
  const closeChat = () => {
    setCurrentChat('')
  }
  //
  const showChat = () => (currentChat.length <= 0) ? <></> : (
    <div className='ComponentChat'>
      <h1 id='currentReme'>{currentReme}</h1>
      <CurrentChat messages={messages} email={email} currentReme={currentReme}></CurrentChat>
      <div className='Controls'>
        <input id="TextInput" type="text" value={message} onChange={(e) => { setMessage(e.currentTarget.value) }} onKeyDown={(e) => { sendMessageByEnter(e) }} />
        <button id="ButtonSendMensage" onClick={sendMessage}> Enviar</button>
        <button id="ButtonCloseChat" onClick={closeChat}> X</button>
      </div>
    </div>
  )
  //
  const findMessagesToSet = (chat_id) => {
    const _chats = JSON.parse(localStorage.getItem('chats'))
    let chat = _chats.find(el => el.chat_id === chat_id)
    setMessages(chat.chat_messages)
  }
  return (
    <>
      <div className='ChatsList'>
        <h1 id='ChatListTitle'>Meus Chats:</h1>
        {
          // chats.map((el, index) => (<div className="ChatsListItem" key={index} onClick={() => { setCurrentChat(el.chat_id); setMessages(el.chat_messages); setCurrentReme(((el.parts.reme_email === email) ? el.parts.dest_name : el.parts.reme_name)) }}> {generateChatName(el.parts)} </div>))
          chats.map((el, index) => (<div className="ChatsListItem" key={index} onClick={() => { setCurrentChat(el.chat_id); findMessagesToSet(el.chat_id); setCurrentReme(((el.parts.reme_email === email) ? el.parts.dest_name : el.parts.reme_name)) }}> {generateChatName(el.parts)} </div>))
        }
      </div>

      {showChat()}

    </>
  )
}
