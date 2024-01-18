// db.js
const { Connection } = require('tedious');
require('dotenv').config();  // This is fine here but ensure it's also at the top of your main server file

// Create connection to your database
const config = {
  authentication: {
    options: {
      userName: process.env.DB_USER,  // Ensure this matches the variable name in your .env file
      password: process.env.DB_PASS   // Ensure this matches the variable name in your .env file
    },
    type: 'default'
  },
  server: process.env.DB_SERVER,  // Ensure this matches the variable name in your .env file
  options: {
    database: process.env.DB_NAME,  // Ensure this matches the variable name in your .env file
    encrypt: true,
    rowCollectionOnRequestCompletion: true
  }
};

console.log(config);  // Debugging: Ensure it prints the correct value

const connection = new Connection(config);

connection.on('connect', err => {
  if (err) {
    console.error('Connection failed:', err);
  } else {
    console.log('Connected to the database.');
  }
});

module.exports = connection;
