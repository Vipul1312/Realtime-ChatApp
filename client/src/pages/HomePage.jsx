import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext)

  return (
    <div className='border w-full h-screen'>
        <div  className={` backdrop-blur-lg outline-none overflow-hidden h-[100%] grid grid-cols- relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
          <Sidebar />
          <ChatContainer />
          <RightSidebar />
        </div>
    </div>
  )
}

export default HomePage