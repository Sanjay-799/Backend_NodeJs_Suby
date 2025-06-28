const db = require('../config/db');

const createProduct = (productData, callback) => {
  const {
    productName,
    price,
    category,
    image,
    bestSeller,
    description,
    firmId
  } = productData;

  const sql = `
    INSERT INTO products (productName, price, category, image, bestSeller, description, firmId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [productName, price, category, image, bestSeller, description, firmId], callback);
};

const getAllProducts = (callback) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, callback);
};

const getProductById = (id, callback) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [id], callback);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById
};
