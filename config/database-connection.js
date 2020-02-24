const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit:1000,
    host: 'localhost',
    // user: 'root',
    // password:'',
    user: 'cas',
    password: 'try',
    database: 'chat-bot',
    multipleStatements: true
});

module.exports = pool;