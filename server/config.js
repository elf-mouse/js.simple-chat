var SERVER = {
  port: 3000
};

var DB = {
  user: '',
  pass: '',
  host: 'localhost',
  port: 27017,
  name: 'test'
};

var CHAT_TYPE = {
  message: 0, // 文字
  image: 1 // 图片
};

DB.auth = (DB.user && DB.pass) ? (DB.user + ':' + DB.pass + '@') : '';

module.exports.server = SERVER;
module.exports.db = DB;
module.exports.chatType = CHAT_TYPE;
