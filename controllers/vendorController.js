const Vendor = require('../models/vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.JWT_SECRET;


const vendorRegister = (req, res) => {
  const { username, email, password } = req.body;

  Vendor.getVendorByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) return res.status(400).json({ error: "Email already taken" });

    bcrypt.hash(password, 10)
      .then(hashedPassword => {
        Vendor.createVendor({ username, email, password: hashedPassword }, (err) => {
          if (err) return res.status(500).json({ error: "Error creating vendor" });
          console.log(email, "registered");
          res.status(201).json({ message: "Vendor registered successfully" });
        });
      })
      .catch(error => {
        console.error("Hashing error:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};


const vendorLogin = (req, res) => {
  const { email, password } = req.body;

  Vendor.getVendorByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

    const vendor = results[0];

    bcrypt.compare(password, vendor.password)
      .then(isPasswordValid => {
        if (!isPasswordValid) {
          return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ vendorId: vendor.id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({
          success: "Login successful",
          token,
          vendorId: vendor.id
        });

        console.log(email, "logged in");
      })
      .catch(error => {
        console.error("Password compare error:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};

// Get all vendors
const getAllVendors = (req, res) => {
  Vendor.getAllVendors((err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json({ vendors: results });
  });
};

// Get vendor by ID
const getVendorById = (req, res) => {
  const vendorId = req.params.id;

  Vendor.getVendorById(vendorId, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Vendor not found" });

    res.status(200).json({ vendor: results[0] });
  });
};

module.exports = {
  vendorRegister,
  vendorLogin,
  getAllVendors,
  getVendorById
};