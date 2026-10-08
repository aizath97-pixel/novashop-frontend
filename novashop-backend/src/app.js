const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Declaración de Endpoints
app.use('/api/products', productRoutes);

// Inicio del servidor Express
app.listen(PORT, () => {
  console.log(`[NovaShop Backend] Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;