const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const cors = require('cors');

const router = require('./router');

let count=0

const app = express();
const server = http.createServer(app);
const io = socketio(server);


io.on('connection', ( socket ) => {
    console.log('new connection')
    socket.on('vsm',({inputValue})=>{
        console.log("ping", inputValue)
    })

    setInterval(()=>{
        socket.emit('live', {liveData: count})
        count++ 
    },3000)

    socket.on('disconnect',()=>{
        console.log('user had left')
    })

})

app.use(router);

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));