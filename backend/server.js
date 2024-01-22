const express = require('express');
const { pool, poolConnect } = require('./db'); // import the pool and poolConnect
const userRoutes = require('./routes/users'); // assuming you have routes set up in users.js

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Middleware to use before your routes are handled
app.use((req, res, next) => {
    req.pool = pool; // Make pool accessible in the request object
    next();
});

// Routes
app.use('/api/users', userRoutes); // Use userRoutes

// Wait for the pool connection before starting the server
poolConnect.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('App starting error:', err.stack);
    process.exit(1);
});
