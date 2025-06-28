const Firm = require('../models/Firm');
const Vendor = require('../models/vendor');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


const addFirm = (req, res) => {
  const { firmName, area, category, region, offer } = req.body;
  const image = req.file ? req.file.filename : null;
  const vendorId = req.vendorId;


  Vendor.getVendorById(vendorId, (err, vendorResults) => {
    if (err) return res.status(500).json({ error: 'Database error (vendor lookup)' });
    if (vendorResults.length === 0) return res.status(404).json({ error: 'Vendor not found' });

    const firmData = {
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor_id: vendorId
    };

    Firm.createFirm(firmData, (err, result) => {
      if (err) {
        console.error('Create firm error:', err);
        return res.status(500).json({ error: 'Error creating firm' });
      }

      return res.status(201).json({
        message: 'Firm added successfully',
        firmId: result.insertId,
        vendorFirmName: firmName
      });
    });
  });
};


const deleteFirmById = (req, res) => {
  const firmId = req.params.firmId;

  const sql = 'DELETE FROM firms WHERE id = ?';
  db.query(sql, [firmId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error deleting firm' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Firm not found' });

    res.status(200).json({ message: 'Firm deleted successfully' });
  });
};

module.exports = {
  addFirm: [upload.single('image'), addFirm],
  deleteFirmById
};
