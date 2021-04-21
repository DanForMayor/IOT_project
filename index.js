const fs = require('fs');
const child_process = require('child_process');
const express = require('express');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

// The page is going to be in EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());

// Set the / path to be the index.ejs file in the views folder
app.get('/',(req, res) =>{
  res.render('index.ejs')
});

// This sets an API endpoint for the device
app.post('/sendDeviceData',(req, res) =>{
  console.log(req.body)

  // Use a secret API token to prevent others from using this API
  if(req.body.apiKey == "_xY|Ytr#T!*MOj>ladOc"){

    // Send the data to the clients
    io.sockets.emit('message', {"tmp":req.body.tmp, "x":req.body.x, "y":req.body.y, "z":req.body.z})

    // Just return the success if everything worked
    res.sendStatus(200);
  }else{
    // Send back a forbidden if they entered the wrong API key
    res.sendStatus(403);
  }
  
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

  
  // Check for client disconnection
  socket.on("disconnect", (reason) => {
    //TODO: I eventually want this to decriment a client count that will print on an LCD display
    console.log(reason)
    // clearInterval(intervalId)
  });

});

