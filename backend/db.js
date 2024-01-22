const sql = require('mssql');
require('dotenv').config();

const connectionString = `Server=tcp:noteconf.database.windows.net,1433;Initial Catalog=noteconfdb;Persist Security Info=False;User ID=noteconf;Password=${process.env.DB_PASS};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`;

const pool = new sql.ConnectionPool(connectionString);

pool.on('error', err => {
    console.error('SQL pool error:', err);
});

const poolConnect = pool.connect();

poolConnect.then(() => {
    console.log('Connected to MSSQL');
}).catch((err) => {
    console.error('Database Connection Failed! Bad Config: ', err)
});

module.exports = {
    sql, // to access sql types
    pool, // to access the pool
    poolConnect // to ensure connection before starting the server
};
