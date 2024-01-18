// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/authUtils'); // Assuming you have this utility

const authenticate = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if there is no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(400).json({ message: 'Token is not valid' });
  }

  // Add user from payload
  req.user = decoded;
  next();
};

module.exports = authenticate;
