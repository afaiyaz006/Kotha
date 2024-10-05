"use client";
import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'

export default function Chat() {

  
  const [messages, setMessages] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const socketRef = useRef<any>(null)
  const [username, setUsername] = useState('')
  const [selectUser, setSelectUser] = useState(String)
  
  const handleSelectUser = (event: any) => {
    const user_name = event.currentTarget.querySelector('div').textContent
    setSelectUser(user_name)

  }

  const allUsers = users.map(([userId, userInfo]) => {
  
    if (userInfo.username != username.toString()) {
      return (
        <div className="flex flex-row " key={userId}>
          <a href="#" onClick={handleSelectUser} className="rounded  border-2 border-slate-900 my-1 hover:bg-blue-400">
            <div className="text-justify text-md align-text-bottom text-slate-900 p-2">
              {userInfo.username}
            </div>
          </a>
        </div>
      )
    }
    else {
      return (
        <div className="flex flex-row " key={userId}>
          <a href="#" className="rounded  border-2 border-slate-900 my-1 hover:bg-blue-400">
            <div className="text-justify text-md align-text-bottom text-slate-900 p-2">
              {userInfo.username}(YOU)
            </div>
          </a>
        </div>
      )

    }
  })


  const allMessages = messages.map((message, index) => {
  
    if (message.from==username.toString()){
      return (
        <div className="flex flex-col border-2 border-slate-950 my-1 p-1 ml-5 mx-1" key={index}>
          <strong>YOU</strong>
          <div>
            {message.content}
          </div>
        </div>
      )
    }
    else{

      return (
        <div className="flex flex-col border-2 border-slate-950 my-1 p-1 mr-5 mx-1" key={index}>
          <strong>{message.from}</strong>
          <div>
            {message.content}
          </div>
        </div>
      )
    }
  })

  useEffect(() => {
    //console.log("HEADER: "+process.env.NEXT_PUBLIC_SECRET_HEADER!)
    const socket = io(process.env.NEXT_PUBLIC_CLOUD_SERVER,
      {
        withCredentials: true,
        extraHeaders: {
          "my-custom-header": process.env.NEXT_PUBLIC_SECRET_HEADER! || ''
        },
      }
    );
    const username = localStorage.getItem('username') || 'anon';
    if (username) {
        setUsername(username);
    } else {
       
        alert("No username found! Redirecting to home.");
        window.location.href = '/';
    }
    socketRef.current = socket
    
    
    const sessionId=localStorage.getItem('sessionId')
    
    if (sessionId){
      const userId=localStorage.getItem(sessionId.toString())
     
      socket.auth={
        sessionId,
        userId,
        username,
      }
      
      //socket.auth={userId}
     // socket.auth={username}

      ///console.log("USERID: ",userId,"SESSIONID: ",sessionId,"username: ",username)
    }else{
      socket.auth={username}
    }
    
    socket.on("connect",()=>{
      console.log("Connected to server")
        
        
    })
    socket.on("session",({sessionId,userId})=>{
      socket.auth={
        sessionId,
        userId,
        username,
      }
      localStorage.setItem("sessionId",sessionId)
      localStorage.setItem(sessionId.toString(),userId.toString())
      //console.log("USERID: ",userId,"SESSIONID: ",sessionId,"username: ",username)  

    })
    
    socket.on("private_message",({content,from,to})=>{
      
      setMessages(messages=>[...messages,{content:content,from:from,to:to}])
        
    })
    socket.on("all_users",(users)=>{
      
      setUsers(users)

    })

    

    
    return () => {
      socket.disconnect()
    }


    })

    function sendMessage(event: any) {
      event.preventDefault()
      const message = event.target.elements.message_box.value
      let toUserid=''
      for(let i=0;i<users.length;i++){
        
        if (users[i][1].username==selectUser){
          toUserid=users[i][0]
          break
        }
      }
    
      if(toUserid!=''){
        socketRef.current.emit("private_message",
          {
            content:message,
            to:toUserid
          }
        )
      }
      if(selectUser){
        setMessages(messages=>[...messages,{
            content:message,
            to:selectUser,
            from:username
        }])
      }
      
      

    }

    return (
      <div className="container mx-auto">
        <div className="mx-2 border-2 border-slate-950 m-1 p-1">
          <div className="mx-2 content-center justify-center text-3xl">
            Kotha-Chat
          </div>
        </div>
        <div className="mx-2 content-center justify-center rounded-xl align-middle shadow-lg">
          <div className="flex flex-col-reverse space-x-2 rounded-xl shadow-lg sm:flex-row">

            <div className="basis-1/4  hover:shadow-lg shadow-sm border-2 border-slate-950 my-1 ">
              <div className="flex flex-col p-3 overflow-y-scroll">
               
                <div className="flex">
                  
                  <div className="shadow-xl">
                    <strong>
                      Active users
                    </strong>
                    <br>
                    </br>
                    <span>Shows user currently active</span>
                  </div>
                </div>
                <div className="flex flex-col font-bold">
                  {allUsers}
                </div>

              </div>
            </div>
            <div className="basis-1/2  hover:shadow-lg shadow-sm border-2 border-slate-950 my-1">
              <p className='p-1'>Messages will appear here</p>
              <p className="p-2">Chat with <strong>{selectUser}</strong></p>
              <div className="flex flex-col overflow-auto scroll-smooth focus:scroll-auto">
              {allMessages}
              </div>
              <form onSubmit={sendMessage}>
                <div className="flex flex-col">
                  <strong className="m-1">Send Message:</strong>

                  <textarea className="border-2 border-black p-1 m-1 row-5" id="message_box"></textarea>
                  <button type="submit" className="border-2 border-slate-900 p-1 m-3 hover:bg-green-600">
                    <p className="text-center">Send Message</p>
                  </button>

                </div>
              </form>

            </div>
            <div className="basis-1/2  hover:shadow-lg shadow-sm border-2 border-slate-950 my-1">
              <div className="flex flex-col border-2 border-slate-950 my-1 mx-1">
                <strong className="p-2"> Intent</strong>
                <div className="p-2">
                  To be implemented.
                </div>
                <button className="border-2 border-slate-900 p-1 m-3 hover:bg-green-600">
                  <p className="text-center">Analyze Intent</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    );
  }
