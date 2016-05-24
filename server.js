var config = require('./server/config.js');
var db = require('./server/db.js');
var io = require('socket.io')(config.server.port);
var chatType = config.chatType;
var users = [];
var conns = {};

function toEmit(socket, type, someone, data) {
  var socketId = conns[someone] || null;
  var username = socket.username;

  if (socketId) {
    if (username) {
      io.sockets.connected[socketId].emit(type, username, data);

      var data = {
        sender: username,
        receiver: someone,
        type: chatType.message,
        content: data
      };

      switch (type) {
        case 'image':
          console.log('[sendImage]Received image: ' + username + ' to ' + someone + ' a pic');
          data.type = chatType.image;
          data.content = ''; // TODO: save image
          break;
        default: // message
          console.log('[sendMessage]Received message: ' + username + ' to ' + someone + ' say ' + data);
          break;
      }

      // insert db
      db.addMessage(data);
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
