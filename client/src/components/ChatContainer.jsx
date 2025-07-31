import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

import EmojiPicker from 'emoji-picker-react' 

const ChatContainer = () => {

  const { messages , selectedUser , setSelectedUser , sendMessage, getMessages } = useContext(ChatContext)
  const { authUser , onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef()

  const [input ,setInput] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  //  emoji handler
  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji.emoji)
  }

  // handle sending a message
  const handleSendMessage = async(e)=>{
    e.preventDefault();
    if(input.trim() === '') return null;
    await sendMessage({text: input.trim()});
    setInput("")
  }

  // handle sending an image
  const handleSendImage = async(e)=>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image file")
      return;
    }
    const reader = new FileReader();

    reader.onloadend = async ()=>{
      await sendMessage({image: reader.result})
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  } 

 useEffect(() => {
  if (selectedUser) {
    getMessages(selectedUser._id);
  }
}, [selectedUser]);

useEffect(()=>{
  if(scrollEnd.current && messages){
    scrollEnd.current.scrollIntoView({ behavior: "smooth"})
  }
},[messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* --------- HEADER--------- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-9 rounded-full '/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'> {selectedUser.fullName} {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-400'></span> } </p>
        <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>

      {/* ------ CHAT AREA ------ */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
       {messages.map((msg,index)=>(
        <div key={index} className={`flex items-end gap-2 justify-end ${ msg.senderId !== authUser._id  && 'flex-row-reverse' }`}>
          {msg.image ? (
            <img src={msg.image} alt="" className='max-w-[230px] border border-gray-600 rounded-lg overflow-hidden mb-8 ' />
          ) : (
            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-blue-800 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none' }`}> {msg.text} </p>
          )}
          <div className='text-center text-md'>
            <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon } alt="" className='w-7 rounded-full'/>
            <p className='text-gray-800'>{ formatMessageTime( msg.createdAt)}</p>
          </div>
          {/* 👇 Attach scroll ref to the actual last message */}
          {index === messages.length - 1 && (
            <div ref={scrollEnd}></div>
          )}
        </div>
      ))}
       <div ref={scrollEnd}></div>
      </div>

        {/* ------ EMOJI PICKER ------ */}
      {showEmojiPicker && (
        <div className='absolute bottom-20 left-10 z-50'>
          <EmojiPicker onEmojiClick={handleEmojiClick} theme='dark' />
        </div>
      )}

      {/* ------ BOTTOM AREA ------ */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 pl-14'>
  <div className='flex-1 flex items-center justify-between px-3 bg-cyan-950 rounded-full'>

    {/* Emoji toggle button */}
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <span className='text-2xl'>😊</span>
          </button>


    {/* Input field */}
    <input
      onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e) : null }
      type='text'
      placeholder='Enter a Message'
      className='flex-1 text-md p-3 pl-4 border-none outline-none bg-transparent text-white placeholder-gray-200'
    />

    {/* Gallery icon + hidden file input */}
    <div className='flex items-center gap-2'>
      <input onChange={handleSendImage} type='file' id='image' accept='image/png , image/jpg , image/jpeg , image/svg' hidden />
      <label htmlFor='image' className='cursor-pointer'>
        <img src={assets.gallery_icon} alt='Gallery' className='w-5 mr-2'/>
      </label>
    </div>
  </div>

  {/* Send button */}
  <img onClick={handleSendMessage} src={assets.send_button} alt='Send' className='cursor-pointer w-7' />
</div>

    </div>
) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt="" />
      <p className='text-4xl font-medium text-amber-800'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer

