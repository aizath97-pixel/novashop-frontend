# NovaShop

NovaShop es una solución web para gestionar inventario de productos y categorías, con un frontend estático en HTML/CSS/JavaScript y un backend REST API desarrollado con Node.js y Express.

## Descripción general

La aplicación permite:

- Registrar, listar, editar y eliminar productos.
- Consultar categorías desde la base de datos.
- Visualizar el stock con indicadores de estado.
- Gestionar inventario desde una interfaz web simple y rápida.
- Conectarse a una API REST para persistencia en MySQL.

## Stack tecnológico

- Frontend: HTML5, CSS3, JavaScript ES6+
- Backend: Node.js, Express.js
- Base de datos: MySQL
- Herramientas: Postman, Git, VS Code

## Estructura del proyecto

```text
NovaShop-project/
├── README.md
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── novashop-backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       │   ├── category.controller.js
│       │   └── product.controller.js
│       ├── models/
│       └── routes/
│           ├── category.routes.js
│           └── product.routes.js
└── postman/
```

## Backend API

El backend queda en la carpeta `novashop-backend` y expone lo siguiente:

### Productos

- `GET /api/products` - Obtiene todos los productos con su categoría.
- `POST /api/products` - Crea un producto.
- `PUT /api/products/:id` - Actualiza un producto por ID.
- `DELETE /api/products/:id` - Elimina un producto por ID.

### Categorías

- `GET /api/categories` - Obtiene todas las categorías.

## Requisitos

- Node.js 18 o superior
- MySQL
- Navegador web moderno

## Configuración del entorno

### 1. Clonar el repositorio

```bash
git clone [https://github.com/aizath97-pixel/novashop-frontend.git](https://github.com/aizath97-pixel/novashop-frontend.git)
cd NovaShop-project
```

### 2. Instalar dependencias del backend

```bash
cd novashop-backend
npm install
```

### 3. Configurar la base de datos MySQL

El proyecto usa la conexión definida en `novashop-backend/src/config/database.js`.

Por defecto espera:

- host: `localhost`
- usuario: `root`
- base de datos: `novashop_db`

Puedes sobrescribir estos valores con variables de entorno en un archivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=novashop_db
PORT=3000
```

Asegúrate de crear la base de datos `novashop_db` en MySQL antes de iniciar la API.

## Ejecutar la aplicación

### Iniciar el backend

Desde `novashop-backend`:

```bash
npm run dev
```

O en producción:

```bash
npm start
```

La API quedará disponible en:

```text
http://localhost:3000
```

### Ejecutar el frontend

Abre el archivo `frontend/index.html` en tu navegador. El frontend envía peticiones a la API del backend en `http://localhost:3000`.

## Funcionalidades principales

- Gestión de productos con nombre, código de barras, stock, precio y categoría.
- Búsqueda por código o nombre del producto.
- Diferenciación visual del stock según nivel:
  - Agotado
  - Bajo stock
  - Stock suficiente
- Interfaz modal para crear y editar productos.

## Notas

- El frontend está construido como una app cliente ligera y no usa frameworks.
- El backend sigue una estructura modular con controladores y rutas separadas.
- La API está pensada para integrarse con MySQL y ser extendida a más módulos comerciales.

## Contribución

1. Crea una rama para tu cambio.
2. Realiza tus modificaciones.
3. Verifica que el backend arranque correctamente.
4. Haz commit y push.

## Licencia

Este proyecto se distribuye bajo la licencia ISC.

