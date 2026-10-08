const express = require('express');
const router = express.Router();

// Importar el controlador correcto de productos
const productController = require('../controllers/product.controller');

// Puntos de acceso para /api/products
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;