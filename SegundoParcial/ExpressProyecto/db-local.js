const mysql = require('mysql2/promise'); 808.5k 

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'cecyt9_local',
    dateStrings: true,
});
