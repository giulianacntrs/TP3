const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null; 
    return next();
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; 
  } catch {
    req.user = null; 
  }

  next();
};

module.exports = optionalAuth;
