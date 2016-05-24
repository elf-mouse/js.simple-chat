import { socket } from './util';

var username = '';

// 测试（真实环境无需手动登录）
document.getElementById('login').addEventListener('click', function() {
  username = document.getElementById('user-a').value;
  console.log('before connect');
  socket.emit('login', username);
}, false);

// 断线
socket.on('disconnected', function() {
  console.log(username + ' over');
});

// 已登录
socket.on('userExisted', function() {
  console.log(username + ' userExisted');
});

// 登录成功
socket.on('loginSuccess', function() {
  console.log(username + ' loginSuccess');
  document.getElementById('user-a').disabled = true;
});
