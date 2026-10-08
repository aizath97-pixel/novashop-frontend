class ProductModel {
  constructor(id_producto, codigo_barras, nombre_producto, precio_venta, stock, id_categoria) {
    this.id_producto = id_producto;
    this.codigo_barras = codigo_barras;
    this.nombre_producto = nombre_producto;
    this.precio_venta = precio_venta;
    this.stock = stock;
    this.id_categoria = id_categoria;
  }

  // Regla de negocio: Comprobar disponibilidad para ventas
  tieneStockSuficiente(cantidadRequerida) {
    return this.stock >= cantidadRequerida;
  }

  // Regla de negocio: Notificación de bajo inventario
  requiereReabastecimiento(stockMinimo = 5) {
    return this.stock <= stockMinimo;
  }
}

module.exports = ProductModel;