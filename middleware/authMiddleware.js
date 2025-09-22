//variable declaration and initialisation
const jwt = require('jsonwebtoken');

//creating a new function for JWT token validation
function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

//exporting the authMiddleware function
module.exports = authMiddleware;
