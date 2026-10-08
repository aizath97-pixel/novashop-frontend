const db = require('../config/database');

// Obtener todas las categorías de la base de datos
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT id_categoria, nombre_categoria FROM categorias ORDER BY nombre_categoria ASC'
    );

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al consultar las categorías',
      error: error.message
    });
  }
};