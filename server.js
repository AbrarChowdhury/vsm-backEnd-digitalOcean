const http = require('http');
const express = require('express');
const bodyParser  = require("body-parser")
const mongoose = require('mongoose')
const socketio = require('socket.io')


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

let count=0
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
const server = http.createServer(app);
const io = socketio(server);

let espCount = "nothing yet"
let spo2 = "nothing yet" 
let pulse ="hardware-fix, Naming convention"
let temp = "nothing yet" 
let ecg = "nothing yet" 


// SOCKET IO 
io.on('connection', ( socket ) => {
    console.log('new connection')
    // console.log(socket)

    socket.on('vsm',({ inputValue })=>{
        console.log("ping", inputValue)
        
    })
    socket.on('message',(message)=>{
        console.log('_____________________________________')
        console.log("ESP-Data ->")
        console.log(message);
        console.log('_____________________________________')
        //sends to all clients except sender
        socket.broadcast.emit('message', message)
    })
    // setInterval(()=>{
    //     socket.emit('live', { count ,espCount, spo2, pulse, temp, ecg })
    //     count++ 
    // },3000)
    socket.emit('vsm',"hello esp");
    
    socket.on('disconnect',()=>{
        console.log('____________DISCONNECTED_________________________')
        console.log('user had left')
    })

})

app.use(router);

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));