// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const productModal = document.getElementById('productModal');
const btnOpenModal = document.getElementById('btnOpenModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const productForm = document.getElementById('productForm');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const searchInput = document.getElementById('searchInput');

// ==========================================
// 2. GESTIÓN DEL MODAL (Abrir / Cerrar)
// ==========================================
btnOpenModal.addEventListener('click', () => {
  productModal.showModal(); // Método nativo de HTML5 <dialog>
});

btnCloseModal.addEventListener('click', () => {
  productModal.close();
  productForm.reset();
});

// ==========================================
// 3. REGISTRO DINÁMICO DE PRODUCTOS (CRUD)
// ==========================================
productForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Detener la recarga de página

  // Obtener valores de los inputs
  const sku = document.getElementById('prodSku').value;
  const name = document.getElementById('prodName').value;
  const category = document.getElementById('prodCategory').value;
  const stock = parseInt(document.getElementById('prodStock').value);
  const rawPrice = parseFloat(document.getElementById('prodPrice').value) || 0;
  const formattedPrice = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
}).format(rawPrice);

  // Generar la nueva fila HTML
  const newRow = document.createElement('tr');
  
  // Determinar la etiqueta del badge según el stock
  const badgeClass = stock > 0 ? 'badge-success' : 'badge-danger';
  const badgeText = stock > 0 ? `${stock} u.` : '0 u. (Agotado)';

  newRow.innerHTML = `
    <td class="font-mono">${sku}</td>
    <td>${name}</td>
    <td>${category}</td>
    <td><span class="badge ${badgeClass}">${badgeText}</span></td>
    <td class="font-semibold">${formattedPrice}</td>
    <td class="text-right">
      <button class="btn-action btn-delete">Eliminar</button>
    </td>
  `;

  // Insertar al inicio de la tabla
  inventoryTableBody.prepend(newRow);

  // Limpiar y cerrar
  productForm.reset();
  productModal.close();
});

// ==========================================
// 4. ELIMINACIÓN DE REGISTROS (Delegación de Eventos)
// ==========================================
inventoryTableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const row = e.target.closest('tr');
    const productName = row.cells[1].innerText;
    
    if (confirm(`¿Estás seguro de que deseas eliminar "${productName}" del inventario?`)) {
      row.remove();
    }
  }
});

// ==========================================
// 5. FILTRADO EN TIEMPO REAL (Búsqueda)
// ==========================================
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const rows = inventoryTableBody.getElementsByTagName('tr');

  Array.from(rows).forEach((row) => {
    const sku = row.cells[0].innerText.toLowerCase();
    const name = row.cells[1].innerText.toLowerCase();

    if (sku.includes(searchTerm) || name.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});