const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'blogDB',
    user: 'root',
    password: 'gangga01'
    
});

module.exports = pool;