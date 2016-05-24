var PORT = 3000;

var io = require('socket.io')(PORT);
var db = require('./server/db.js');
var users = [];
var conns = {};

function toEmit(socket, type, someone, data) {
  var socketId = conns[someone] || null;
  var username = socket.username;

  if (socketId) {
    if (username) {
      io.sockets.connected[socketId].emit(type, username, data);

      switch (type) {
        case 'message':
          console.log('[sendMessage]Received message: ' + username + ' to ' + someone + ' say ' + data);
          // insert
          var data = {
            sender: username,
            receiver: someone,
            type: 0,
            content: data
          };
          db.addMessage(data);
          break;
        case 'image':
          console.log('[sendImage]Received image: ' + username + ' to ' + someone + ' a pic');
          // save image
          break;
      }
    } else {
      console.log(username + ' unlogin');
    }
  } else {
    console.log(someone + ' offline');
  }
}

io.on('connection', function(socket) {
  console.log('[connection]Connection ' + socket.id + ' accepted.');

  socket.on('login', function(username) {
    if (users.indexOf(username) > -1) {
      console.log('[login]' + username + ' is existed');
      socket.emit('userExisted');
    } else {
      socket.userIndex = users.length;
      socket.username = username;

      users.push(username);
      conns[username] = socket.id;

      console.log('[login]' + username + ' sign in');
      socket.emit('loginSuccess');
    }
  });

  socket.on('disconnect', function() {
    console.log('[disconnect]Connection ' + socket.id + ' terminated.');

    users.splice(socket.userIndex, 1);
    delete conns[socket.username];
    socket.broadcast.emit('system', socket.username, users.length, 'disconnect');
  });

  socket.on('message', function(someone, message) {
    toEmit(socket, 'message', someone, message);
  });

  socket.on('image', function(someone, imgData) {
    toEmit(socket, 'image', someone, imgData);
  });
});
