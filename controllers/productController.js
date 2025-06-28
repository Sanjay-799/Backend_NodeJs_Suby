const Product = require('../models/Product');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Add Product Controller
const addProduct = (req, res) => {
  const { productName, price, category, bestSeller, description } = req.body;
  const image = req.file ? req.file.filename : null;
  const firmId = req.params.firmId;

  // Check firm existence
  const checkFirmSQL = 'SELECT * FROM firms WHERE id = ?';
  db.query(checkFirmSQL, [firmId], (err, firmResults) => {
    if (err) return res.status(500).json({ error: 'Firm lookup failed' });
    if (firmResults.length === 0) return res.status(404).json({ error: 'Firm not found' });

    const productData = {
      productName,
      price,
      category,
      image,
      bestSeller,
      description,
      firmId
    };

    Product.createProduct(productData, (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ error: 'Error saving product' });
      }

      return res.status(201).json({
        message: 'Product added successfully',
        productId: result.insertId
      });
    });
  });
};

// Get Products by Firm
const getProductByFirm = (req, res) => {
  const firmId = req.params.firmId;

  const sql = `
    SELECT p.*, f.firmName 
    FROM products p 
    JOIN firms f ON p.firmId = f.id 
    WHERE p.firmId = ?
  `;

  db.query(sql, [firmId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching products' });
    if (results.length === 0) return res.status(404).json({ message: 'No products found' });

    const restaurantName = results[0].firmName;
    const products = results.map(p => ({
      id: p.id,
      productName: p.productName,
      price: p.price,
      category: p.category,
      image: p.image,
      bestSeller: p.bestSeller,
      description: p.description
    }));

    res.status(200).json({ restaurantName, products });
  });
};

// Delete Product
const deleteProductById = (req, res) => {
  const productId = req.params.productId;

  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error deleting product' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  });
};

module.exports = {
  addProduct: [upload.single('image'), addProduct],
  getProductByFirm,
  deleteProductById
};
