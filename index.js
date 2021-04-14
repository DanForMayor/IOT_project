const fs = require('fs');
const express = require('express');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// The page is going to be in EJS
app.set('view engine', 'ejs');

// Set the / path to be the index.ejs file in the views folder
app.get('/',(req, res) =>{
  res.render('index.ejs')
});

// Set the port for the server to listen on
server.listen(3000, ()=>{
  console.log("server running on port 3000...")
})

// Set the 'connection' socket for detecting when a client has connected
io.on('connection', (socket) => {

  // Show the client ID in console
  console.log("User connected: " + socket.id);

  // Start sending the client the temperature data, every second
  setInterval(() => {
    
    // TODO: this is a placeholder -- It's going to be reading a test file and sending it's data to the client
    // This will be replaced with a call to a python script
    fs.readFile(__dirname+'/testfile.txt', 'utf8', (err,data) =>{

      // Send either the error or the data, depending on what happens
      if(err) socket.emit('message', err);
      else    socket.emit('message', data);

    })
  }, 1000);

});

