const db = require('../config/database');

// 1. Obtener todos los productos con la información de su categoría
exports.getProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.nombre_categoria 
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_producto DESC
    `;
    const [products] = await db.query(query);

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al consultar los productos',
      error: error.message
    });
  }
};

// 2. Registrar un nuevo producto en el inventario
exports.createProduct = async (req, res) => {
  const { codigo_barras, nombre_producto, precio_venta, stock, id_categoria } = req.body;

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

// 3. Actualizar un producto existente por ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { codigo_barras, nombre_producto, precio_venta, stock, id_categoria } = req.body;

  try {
    const query = `
      UPDATE productos 
      SET codigo_barras = ?, nombre_producto = ?, precio_venta = ?, stock = ?, id_categoria = ?
      WHERE id_producto = ?
    `;
    const [result] = await db.query(query, [
      codigo_barras,
      nombre_producto,
      precio_venta,
      stock,
      id_categoria,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

// 4. Eliminar un producto del inventario por su ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM productos WHERE id_producto = ?';
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró el producto a eliminar'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente de la base de datos'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto. Puede estar vinculado a registros activos.',
      error: error.message
    });
  }
};