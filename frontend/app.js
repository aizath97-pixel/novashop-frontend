// ==========================================
// CONFIGURACIÓN Y CONSTANTES
// ==========================================
const API_URL = 'http://localhost:3000/api/products';
const CATEGORIES_API_URL = 'http://localhost:3000/api/categories';

// Elementos del DOM
const productModal = document.getElementById('productModal');
const btnOpenModal = document.getElementById('btnOpenModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const productForm = document.getElementById('productForm');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('prodCategory');
const modalTitle = document.querySelector('.modal-title');

// Variable de estado para controlar la edición
let editingProductId = null;

// Formateador de precios a Pesos Colombianos (COP)
const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

// Función para reiniciar el estado y la interfaz del modal
function resetModal() {
  editingProductId = null;
  if (modalTitle) modalTitle.innerText = 'Agregar Nuevo Producto';
  productForm.reset();
}

// ==========================================
// 1. CARGA DE DATOS (PRODUCTOS Y CATEGORÍAS)
// ==========================================
async function loadCategories() {
  try {
    const response = await fetch(CATEGORIES_API_URL);
    const result = await response.json();

    if (result.success && categorySelect) {
      categorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';
      result.data.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id_categoria;
        option.textContent = cat.nombre_categoria;
        categorySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
  }
}

async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.success) {
      renderTable(result.data);
    } else {
      console.error('Error del servidor:', result.message);
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error);
  }
}

function renderTable(products) {
  inventoryTableBody.innerHTML = '';

  if (products.length === 0) {
    inventoryTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center" style="padding: 1.5rem; color: #6b7280;">
          No hay productos registrados en la base de datos.
        </td>
      </tr>
    `;
    return;
  }

  products.forEach(product => {
  const row = document.createElement('tr');
  
  // --- LÓGICA DE BADGES POR NIVELES DE STOCK ---
  let badgeClass = 'badge-danger'; // Rojo por defecto (Agotado = 0)
  let badgeText = '0 u. (Agotado)';

  if (product.stock > 5) {
    badgeClass = 'badge-success';  // Verde: Stock suficiente (> 5 unidades)
    badgeText = `${product.stock} u.`;
  } else if (product.stock > 0) {
    badgeClass = 'badge-warning';  // Amarillo: Bajo stock (entre 1 y 5 unidades)
    badgeText = `${product.stock} u. (Bajo stock)`;
  }
  // ----------------------------------------------

  row.innerHTML = `
    <td class="font-mono">${product.codigo_barras || 'N/A'}</td>
    <td>${product.nombre_producto}</td>
    <td>${product.nombre_categoria || 'Sin categoría'}</td>
    <td><span class="badge ${badgeClass}">${badgeText}</span></td>
    <td class="font-semibold">${currencyFormatter.format(product.precio_venta)}</td>
    <td class="text-right">
      <button class="btn-action btn-edit" data-id="${product.id_producto}">Editar</button>
      <button class="btn-action btn-delete" data-id="${product.id_producto}">Eliminar</button>
    </td>
  `;
  inventoryTableBody.appendChild(row);
});
}

// ==========================================
// 2. GUARDAR PRODUCTO (POST / PUT)
// ==========================================
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const productData = {
    codigo_barras: document.getElementById('prodSku').value.trim(),
    nombre_producto: document.getElementById('prodName').value.trim(),
    id_categoria: parseInt(document.getElementById('prodCategory').value),
    stock: parseInt(document.getElementById('prodStock').value),
    precio_venta: parseFloat(document.getElementById('prodPrice').value)
  };

  const isEditing = editingProductId !== null;
  const url = isEditing ? `${API_URL}/${editingProductId}` : API_URL;
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    const result = await response.json();

    if (result.success) {
      productModal.close();
      resetModal();
      await loadProducts();
    } else {
      alert(`Error al guardar: ${result.message}`);
    }
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    alert('No se pudo conectar con el servidor backend.');
  }
});

// ==========================================
// 3. CONTROL DEL MODAL Y BÚSQUEDA
// ==========================================
btnOpenModal.addEventListener('click', () => {
  resetModal();
  productModal.showModal();
});

btnCloseModal.addEventListener('click', () => {
  productModal.close();
  resetModal();
});

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const rows = inventoryTableBody.getElementsByTagName('tr');

  Array.from(rows).forEach(row => {
    if (row.cells.length < 2) return;
    const sku = row.cells[0].innerText.toLowerCase();
    const name = row.cells[1].innerText.toLowerCase();

    if (sku.includes(searchTerm) || name.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// ==========================================
// 4. ACCIONES DE TABLA (EDITAR Y ELIMINAR)
// ==========================================
inventoryTableBody.addEventListener('click', async (e) => {
  const editBtn = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');

  // --- OPCIÓN A: EDITAR PRODUCTO ---
  if (editBtn) {
    const id = editBtn.getAttribute('data-id');
    const row = editBtn.closest('tr');
    if (!id) return;

    editingProductId = id;
    if (modalTitle) modalTitle.innerText = 'Editar Producto';

    document.getElementById('prodSku').value = row.cells[0].innerText.trim();
    document.getElementById('prodName').value = row.cells[1].innerText.trim();

    // Extraer solo dígitos para el stock
    const rawStock = row.cells[3].innerText.replace(/[^0-9]/g, '');
    document.getElementById('prodStock').value = parseInt(rawStock) || 0;

    // CORRECCIÓN: Extraer solo dígitos para evitar perder los 3 ceros de los miles
    const rawPrice = row.cells[4].innerText.replace(/[^0-9]/g, '');
    document.getElementById('prodPrice').value = parseFloat(rawPrice) || 0;

    const categoryText = row.cells[2].innerText.trim();
    for (let option of categorySelect.options) {
      if (option.text.trim() === categoryText) {
        option.selected = true;
        break;
      }
    }

    productModal.showModal();
  }

  // --- OPCIÓN B: ELIMINAR PRODUCTO ---
  if (deleteBtn) {
    const id = deleteBtn.getAttribute('data-id');
    const row = deleteBtn.closest('tr');

    if (!id) {
      alert('Este registro no tiene un ID de base de datos asociado.');
      return;
    }

    const productName = row.cells[1].innerText;

    if (confirm(`¿Estás seguro de que deseas eliminar "${productName}" del inventario?`)) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          await loadProducts();
        } else {
          alert(`Error al eliminar: ${result.message}`);
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('No se pudo conectar con el servidor.');
      }
    }
  }
});

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCategories();
});