const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'svc.sel5.cloudtype.app',
  user: 'hyeon',
  password: '1234',
  database: 'fubao',
  port: 32234,
});

module.exports = connection;
