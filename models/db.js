const mysql = require('mysql');
const dbconfig = require('../config/dbconfig');

// DB 커넥션 생성
const connection = mysql.createConnection({
  connectionLimit: 10,
  host: dbconfig.host,
  user: dbconfig.user, 
  password: dbconfig.password, 
  database: dbconfig.database,
  debug:false
}); 

// DB 접속
connection.connect();

module.exports = connection;
