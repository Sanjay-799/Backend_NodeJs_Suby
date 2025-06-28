const Vendor = require('../models/vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const vendorId = decoded.vendorId;

    Vendor.getVendorById(vendorId, (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      req.vendorId = vendorId; 
      next();
    });
  } catch (error) {
    console.error("JWT error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;