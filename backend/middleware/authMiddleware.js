import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// This is our primary "Security Guard" middleware
const protect = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token using the secret key from your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user and attach them to the request object
      req.user = await User.findById(decoded.userId).select('-password');
      
      next(); // Proceed to the next step
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// This is our role-based "Specialist Guard" middleware
const provider = (req, res, next) => {
    if (req.user && req.user.role === 'provider') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a provider' });
    }
};

// THIS IS THE CRITICAL FIX
// This line makes the 'protect' and 'provider' functions available to other files.
export { protect, provider };

