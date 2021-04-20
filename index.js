const fs = require('fs');
const child_process = require('child_process');
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
  //TODO: I eventually want this to increment a client count that will print on an LCD display

  // Show the client ID in console
  console.log("User connected: " + socket.id);

  // Start sending the client the temperature data, every second
  setInterval(() => {

    child_process.exec('python3 /home/pi/gyro_temp.py', (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        return;
      }
      socket.emit('message',JSON.parse(stdout));
    });
  }, 1000);
  
  // Check for client disconnection
  socket.on("disconnect", (reason) => {
    //TODO: I eventually want this to decriment a client count that will print on an LCD display
    console.log(reason)
  });

});

