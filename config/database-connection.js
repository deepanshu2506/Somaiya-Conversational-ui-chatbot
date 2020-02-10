const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit:1000,
    host: 'localhost',
    user: 'try',
    password: 'cas',
    database: 'chat-bot',
    multipleStatements: true
});

module.exports = pool;