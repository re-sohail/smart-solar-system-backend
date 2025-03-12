const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res.sendError({
      message: "Unauthorized User",
      statusCode: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.sendError({
      message: "Unauthorized User",
      statusCode: 401,
    });
  }
};

// Authorization Middleware Factory
const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.sendError({
        message: "Forbidden",
        statusCode: 401,
      });
    }
    next();
  };
};

module.exports = { authMiddleware, permit };
