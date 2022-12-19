import React from 'react'
import './CurrentChat.css'

export default function CurrentChat({ messages, email, currentReme }) {


  const genMessage = (msg) => {
    return msg.substr(msg.indexOf('#{?/') + 4)
  }
  return (
    <div className='CurrentChat'>
      {messages.map((el, index) => (<span key={index} className={(el.includes(email)) ? 'reme' : (el.includes("_s'rv#{?/") ? 'srv' : 'dest')}>{genMessage(el)}</span >))}
    </div>
  )
}
