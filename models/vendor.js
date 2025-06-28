
const db = require('../config/db');


const createVendor = (vendorData, callback) => {
  const sql = 'INSERT INTO vendors (username, email, password) VALUES (?, ?, ?)';
  const { username, email, password } = vendorData;
  db.query(sql, [username, email, password], callback);
};


const getVendorByEmail = (email, callback) => {
  const sql = 'SELECT * FROM vendors WHERE email = ?';
  db.query(sql, [email], callback);
};


const getAllVendors = (callback) => {
  const sql = 'SELECT * FROM vendors';
  db.query(sql, callback);
};


const getVendorById = (id, callback) => {
  const sql = 'SELECT * FROM vendors WHERE id = ?';
  db.query(sql, [id], callback);
};

module.exports = {
  createVendor,
  getVendorByEmail,
  getAllVendors,
  getVendorById
};