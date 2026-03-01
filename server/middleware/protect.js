const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Token comes in the request header like:
    // Authorization: Bearer eyJhbGci...
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not logged in. Please login first.' });
    }

    // Extract just the token part
    const token = authHeader.split(' ')[1];

    // Verify the token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { userId: '...', iat: ..., exp: ... }

    // Attach user to the request so next route can use it
    req.user = await User.findById(decoded.userId).select('-password');
    // select('-password') means fetch everything EXCEPT password

    next(); // move on to the actual route
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = protect;