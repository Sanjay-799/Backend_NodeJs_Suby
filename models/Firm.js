const db = require('../config/db');


const createFirm = (firmData, callback) => {
  const {
    firmName,
    area,
    category,     
    region,       
    offer,
    image,
    vendor_id
  } = firmData;

  const sql = `
    INSERT INTO firms (firmName, area, category, region, offer, image, vendor_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [firmName, area, category, region, offer, image, vendor_id], callback);
};


const getAllFirms = (callback) => {
  const sql = 'SELECT * FROM firms';
  db.query(sql, callback);
};


const getFirmById = (id, callback) => {
  const sql = 'SELECT * FROM firms WHERE id = ?';
  db.query(sql, [id], callback);
};

module.exports = {
  createFirm,
  getAllFirms,
  getFirmById
};