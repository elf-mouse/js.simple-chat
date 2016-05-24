var config = require('./config.js');
var mongoose = require('mongoose');

var DB_URI = 'mongodb://' + config.auth + config.host + ':' + config.port + '/' + config.name;
mongoose.connect(DB_URI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB connected');
});

var chatSchema = mongoose.Schema({
  sender: String,
  receiver: String,
  type: Number, // 0: message, 1: image
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
});
var Chat = mongoose.model('Chat', chatSchema);

function addMessage(data) {
  var chat = new Chat(data);
  console.log('save chat', chat);

  chat.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
    }
  });
}

module.exports.addMessage = addMessage;
