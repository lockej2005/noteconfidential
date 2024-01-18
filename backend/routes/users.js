// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Connection, Request } = require('tedious');
const router = express.Router();

// Connection configuration moved to a separate module or file for reusability
const connection = require('../db'); // This should be your configured tedious connection

// Helper function to execute SQL query
const executeSql = (sql, callback) => {
  const request = new Request(sql, (err, rowCount, rows) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null, { rowCount, rows });
    }
  });

  connection.execSql(request);
};

// User signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // SQL query to check if user exists and to insert a new user
    const checkUserSql = `SELECT * FROM Users WHERE Email = '${email}'`;
    const insertUserSql = `INSERT INTO Users (Name, Email, Password) VALUES ('${name}', '${email}', '${hashedPassword}')`;

    // Check if user exists
    executeSql(checkUserSql, (err, result) => {
      if (err) return res.status(500).send('Server error');

      if (result.rowCount > 0) {
        return res.status(400).json({ message: 'User already exists' });
      } else {
        // Create user
        executeSql(insertUserSql, (err, result) => {
          if (err) return res.status(500).send('Server error');

          // Create token
          const payload = { user: { email } }; // Payload typically contains user identification info
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

          res.status(201).json({ token });
        });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const checkUserSql = `SELECT * FROM Users WHERE Email = '${email}'`;

  executeSql(checkUserSql, async (err, result) => {
    if (err) return res.status(500).send('Server error');

    if (result.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const user = result.rows[0]; // Assuming you have logic to parse rows into a user object

    // Validate password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Create token
    const payload = { user: { email: user.Email } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  });
});

module.exports = router;
