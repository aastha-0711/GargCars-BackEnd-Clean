const jwt = require("jsonwebtoken");

// Middleware to protect routes (checks for a valid JWT)
exports.authenticateToken = function (req, res, next) {
  // Get token from header. Common practice is 'Authorization: Bearer <token>'
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Extract the token part (remove "Bearer ")
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Optional: Middleware to check for Admin role
exports.authorizeAdmin = (req, res, next) => {
  // This middleware should run AFTER authenticateToken, so req.user exists
  if (!req.user || !req.user.admin) {
    return res
      .status(403)
      .json({ message: "Access denied: Admin privileges required" });
  }
  next();
};
