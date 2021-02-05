const http = require('http');
const express = require('express');
const WebSocket = require('ws')
const bodyParser  = require("body-parser")
const mongoose = require('mongoose')
const port = 8080
const cors = require('cors')

//db
const dbUri = "mongodb+srv://abrar:abrar123@cluster0.gzrt5.mongodb.net/vsm?retryWrites=true&w=majority"
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.log('Mongo Connection Error: ',err);
    }else{
        console.log('Mongo Connection established')
    }
});

const router = require('./router');

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(router);

let connection
const httpServer = http.createServer(app)
const wss = new WebSocket.Server({
    'server': httpServer
})

app.get("/",(req,res)=>{
    res.send(`VSM Bioforge ${connection}`)
})

wss.on("connection", function (ws) {
  console.log("new client connected");
  connection = "connected"
  ws.on("close", function () {
    console.log("lost one client");
  });
  ws.on("message", function (message) {
    console.log("Received: " + message)
    console.log("---------------------------")
    //broadcast incoming message to all clients (s.clients)
    if((JSON.parse(message).password==1234) && (JSON.parse(message).deviceId=="vsmBioforge")){
      wss.clients.forEach(function (client) {
        if (client != ws && client.readyState) {
          client.send(message)
        }
      });
    }else{
      console.log("un-authorized device");
    }
  });
});
wss.on("close",()=>{
  console.log("client disconnected")
})

httpServer.listen(port, ()=>console.log(`server listening at port ${port}`))