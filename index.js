// const app = require('express')();
// const http = require('http').createServer(app);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname +'/html/index.html');
// });

// http.listen(3000, () => {
//   console.log('listening on *:3000');
// });

const express = require('express');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors:{origin:'*'}});

app.set('view engine', 'ejs');

app.get('/',(req, res) =>{
  res.render('index.ejs')
});

server.listen(3000, ()=>{
  console.log("server running")
})

io.on('connection', (socket) => {
  console.log("User connected: " + socket.id);
});

