var DB = {
  user: '',
  pass: '',
  host: 'localhost',
  port: 27017,
  name: 'test'
};

DB.auth = (DB.user && DB.pass) ? (DB.user + ':' + DB.pass + '@') : '';

module.exports = DB;
