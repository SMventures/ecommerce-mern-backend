const express = require('express');
const multer = require('multer');

const router = express.Router();
const productController = require("../controllers/product.controller.js");

// Configure Multer storage for memory
const storage = multer.memoryStorage();

const upload = multer({ storage }); // Create Multer instance with memory storage

// Route for creating a product with image upload in memory
router.post('/', upload.single('imageFile'), productController.createProduct);

// Other routes (no Multer needed for these)
router.post('/creates', productController.createMultipleProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/:id', productController.updateProduct);

module.exports = router;
