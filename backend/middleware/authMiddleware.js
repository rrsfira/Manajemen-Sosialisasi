const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenBlacklist = require("./tokenBlacklist");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token required" });

  if (tokenBlacklist.includes(token)) {
    return res.status(403).json({ message: "Token has been revoked (blacklisted)" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Token invalid" });
    }

    req.user = user;
    next();
  });
};

module.exports = { verifyToken };
