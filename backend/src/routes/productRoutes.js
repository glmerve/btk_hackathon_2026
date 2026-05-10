const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);

module.exports = router;
