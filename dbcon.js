var mysql = require('mysql');
/*
var pool = mysql.createPool({
    host  : 'localhost',
    user  : 'student',
    password: 'default',
    database: 'student'
});
*/

var pool = mysql.createPool({
    host  : 'classmysql.engr.oregonstate.edu',
    user  : 'cs290_hustond',
    password: '6459',
    database: 'cs290_hustond'
});

module.exports.pool = pool;

