const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const {UserManager}=require('./db.js')
require('dotenv').config()
app.get('/', (req, res) => {
  res.send('SOCKET SERVER RUNNING');
});
const usermanager = new UserManager()
const crypto = require("crypto");
const randomId=()=>{
  return  crypto.randomBytes(8).toString("hex");
}


const socket_server = new Server(server, {
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
})

socket_server.use((socket,next)=>{
  console.log("SOCKET HANDSHAKE:",socket.handshake.auth)
 
  const sessionId=socket.handshake.auth.sessionId;

  if (sessionId){
    
    const session=usermanager.getSession(sessionId)
    console.log("FOUND SESSION",session)
    if(session){
      socket.sessionId=sessionId
      socket.userId=session.userId
     
      //console.log("USERS: ",users)
      //console.log("FOUND SESSION: ",socket.sessionId,socket.userId,socket.handshake.auth.username)
      return next()
    }
  }
  const username=socket.handshake.auth.username
 
  socket.sessionId=randomId()
  socket.userId=randomId()
  socket.username=username
 
  //console.log("CREATED SESSION",sessionInfos)
  //console.log("USERS: ",users)
  next()


})


socket_server.on("connection",(socket)=>{
  
  console.log("Connected to a client")
  socket.join(socket.userId)
  
  usermanager.setSession(socket.sessionId,{
      sessionId:socket.sessionId,
      userId:socket.userId,
      username:socket.handshake.auth.username
    })
  usermanager.addUser(socket.userId,{
      username:socket.handshake.auth.username,
      //sessionId:socket.sessionId
  })

  userSerialized=usermanager.getAllUsers()
  ///console.log(userSerialized.length)
  //console.log("USERS FROM SERVER: ",userSerialized)
  socket.emit("all_users",userSerialized)
  socket.broadcast.emit("all_users",userSerialized)
  
  
  socket.emit("session",{
    sessionId:socket.sessionId,
    userId:socket.userId,
    
  })



  
  ///console.log(usermanager.getUser(socket.userId).username)
  
  socket.on("private_message",({content,to})=>{
    //console.log("CAUGHT MESSAGE: ",content,to,socket.username,socket.userId)
    socket.to(to).to(socket.userId).emit("private_message",{
      content,
      from_username:socket.username,
      from_userId:socket.userId,
      to:to,  
    })
  })




  socket.on("disconnect",(reason)=>{
    usermanager.removeUser(socket.userId)
    usermanager.removeSession(socket.sessionId)
    socket.broadcast.emit("all_users",usermanager.getAllUsers())
    console.log("Disconnected from a client")
  })
  
  



})



server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});
