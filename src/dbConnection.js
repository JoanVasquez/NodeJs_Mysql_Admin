const mysql = require('mysql');
let pool;
module.exports = {
  getPool: () => {
    if(pool) return pool;
    pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      password: 'pass',
      database: 'mysql'
    });
    return pool;
  }
}
