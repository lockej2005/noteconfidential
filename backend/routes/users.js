const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../db'); // Import sql to use SQL types
const router = express.Router();

// User signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const pool = req.pool; // Get the pool from the request object

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const request = pool.request();
        request.input('Email', sql.NVarChar, email);

        // Check if user exists
        const checkUserResult = await request.query('SELECT * FROM usersTbl WHERE Email = @Email');
        if (checkUserResult.recordset.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        request.input('Name', sql.NVarChar, name);
        request.input('Password', sql.NVarChar, hashedPassword);
        await request.query('INSERT INTO usersTbl (Name, Email, Password) VALUES (@Name, @Email, @Password)');

        // Create token
        const payload = { user: { email } }; // Payload typically contains user identification info
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const pool = req.pool; // Get the pool from the request object

    try {
        const request = pool.request();
        request.input('Email', sql.NVarChar, email);

        // Check for user
        const userResult = await request.query('SELECT * FROM usersTbl WHERE Email = @Email');
        if (userResult.recordset.length === 0) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const user = userResult.recordset[0];

        // Validate password
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create token
        const payload = { user: { id: user.id, email: user.Email } }; // Adjust 'id', 'Email' if your column names are different
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
