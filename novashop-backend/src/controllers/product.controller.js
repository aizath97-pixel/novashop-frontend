const db = require('../config/database');

// 1. Obtener todos los productos con el nombre de su categoría asociada
exports.getProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.id_producto, p.codigo_barras, p.nombre_producto, p.precio_venta, p.stock, c.nombre_categoria
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_producto DESC
    `;
    const [rows] = await db.query(query);

    res.status(200).json({
      success: true,
      message: 'Catálogo de productos obtenido con éxito',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al consultar los productos en la base de datos',
      error: error.message
    });
  }
};

// 2. Registrar un nuevo producto en el inventario
exports.createProduct = async (req, res) => {
  const { codigo_barras, nombre_producto, precio_venta, stock, id_categoria } = req.body;

  // Validación básica de campos requeridos
  if (!nombre_producto || !precio_venta || !id_categoria) {
    return res.status(400).json({
      success: false,
      message: 'Los campos nombre_producto, precio_venta e id_categoria son obligatorios'
    });
  }

  try {
    const query = `
      INSERT INTO productos (codigo_barras, nombre_producto, precio_venta, stock, id_categoria)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      codigo_barras || null,
      nombre_producto,
      precio_venta,
      stock || 0,
      id_categoria
    ]);

    res.status(201).json({
      success: true,
      message: 'Producto registrado exitosamente',
      data: {
        id_producto: result.insertId,
        codigo_barras,
        nombre_producto,
        precio_venta,
        stock: stock || 0,
        id_categoria
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al insertar el producto',
      error: error.message
    });
  }
};