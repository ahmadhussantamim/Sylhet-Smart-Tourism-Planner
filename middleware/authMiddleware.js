// middleware/authMiddleware.js
// -----------------------------------------------------------------------
// Middleware = a function that runs BEFORE the controller, and decides
// whether the request is allowed to continue.
//
// `protect`      -> checks that a valid JWT was sent, blocks the request
//                    if not, and attaches the decoded user info to req.user
// `authorize()`  -> checks that req.user.role is one of the allowed roles
//                    (use AFTER `protect`)
// -----------------------------------------------------------------------

const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized. Token invalid or expired.' });
  }
};

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do this.' });
    }
    next();
  };
};
