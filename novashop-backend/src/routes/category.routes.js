const express = require('express');
const router = express.Router();

// Importar SOLO el controlador de categorías
const categoryController = require('../controllers/category.controller');

// Punto de acceso para /api/categories
router.get('/', categoryController.getCategories);

module.exports = router;