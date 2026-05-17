# API REST - Gestión de Clientes 🧑‍💼

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

API REST con operaciones **CRUD** seguras para la gestión de la entidad `cliente`, desarrollada con **Node.js**, **Express** y **MySQL**.

Actividad sumativa de la **Semana 9 — CIB302 Taller de Plataformas Web — AIEP**.

---

## 📋 Tabla de contenidos

1. [Requisitos previos](#-requisitos-previos)
2. [Instalación y ejecución](#-instalación-y-ejecución)
3. [Endpoints disponibles](#-endpoints-disponibles)
4. [Modelo de datos](#-modelo-de-datos)
5. [Seguridad implementada](#️-seguridad-implementada)
6. [Manejo de errores](#-manejo-de-errores)
7. [Pruebas con Postman](#-pruebas-con-postman)
8. [Estructura del proyecto](#️-estructura-del-proyecto)
9. [Tecnologías utilizadas](#-tecnologías-utilizadas)

---

## 📦 Requisitos previos

- **Node.js** v18 o superior — [Descargar](https://nodejs.org)
- **MySQL** 8.x (o MariaDB compatible)
- **Postman** para probar los endpoints
- **Git**

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/api-clientes.git
cd api-clientes
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear la base de datos
Ejecuta el script `database/schema.sql` en tu cliente MySQL:
```bash
mysql -u root -p < database/schema.sql
```

### 4. Configurar variables de entorno
Copia el archivo `.env.example` como `.env` y edita las credenciales:
```bash
cp .env.example .env
```
Edita el archivo `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=cib302_clientes
DB_PORT=3306
```

### 5. Iniciar el servidor
```bash
# Modo producción
npm start

# Modo desarrollo (con recarga automática)
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

---

## 📡 Endpoints disponibles

Base URL: `http://localhost:3000/api/clientes`

| Método   | Ruta                  | Descripción                  | Códigos HTTP            |
|----------|-----------------------|------------------------------|-------------------------|
| `GET`    | `/api/clientes`       | Listar todos los clientes    | `200`                   |
| `GET`    | `/api/clientes/:id`   | Obtener cliente por ID       | `200` `400` `404`       |
| `POST`   | `/api/clientes`       | Crear nuevo cliente          | `201` `400` `409`       |
| `PUT`    | `/api/clientes/:id`   | Actualizar cliente           | `200` `400` `404` `409` |
| `DELETE` | `/api/clientes/:id`   | Eliminar cliente             | `200` `400` `404`       |

### Ejemplo de cuerpo (POST / PUT)
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.cl",
  "telefono": "+56912345678"
}
```

### Ejemplo de respuesta exitosa (201)
```json
{
  "success": true,
  "mensaje": "Cliente creado correctamente",
  "data": {
    "id_cliente": 6,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.cl",
    "telefono": "+56912345678",
    "created_at": "2025-04-15T18:32:45.000Z"
  }
}
```

### Ejemplo de respuesta de error (409)
```json
{
  "success": false,
  "statusCode": 409,
  "error": "Conflict",
  "mensaje": "Ya existe un cliente con el correo juan@ejemplo.cl"
}
```

---

## 🗄️ Modelo de datos

Tabla `cliente`:

| Columna     | Tipo           | Restricciones                              |
|-------------|----------------|--------------------------------------------|
| id_cliente  | `INT`          | `PRIMARY KEY`, `AUTO_INCREMENT`            |
| nombre      | `VARCHAR(100)` | `NOT NULL`                                 |
| email       | `VARCHAR(150)` | `NOT NULL`, `UNIQUE`                       |
| telefono    | `VARCHAR(20)`  | `NOT NULL`                                 |
| created_at  | `DATETIME`     | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP`    |

La restricción **UNIQUE** sobre `email` es la que habilita la respuesta **409 Conflict** cuando se intenta registrar un correo ya existente.

---

## 🛡️ Seguridad implementada

| Medida | Implementación |
|--------|----------------|
| **Prevención de SQL Injection** | Todas las consultas usan **prepared statements** (parámetros `?` con `mysql2/promise`). |
| **Validación de entrada** | `express-validator` valida tipo, formato, longitud y caracteres de cada campo antes de tocar la BD. |
| **Cabeceras HTTP seguras** | `helmet` agrega `X-Frame-Options`, `Content-Security-Policy`, `X-Content-Type-Options`, etc. |
| **Rate limiting** | `express-rate-limit`: máximo 100 peticiones por IP cada 15 minutos. |
| **CORS controlado** | `cors` configurable vía `.env` para limitar orígenes permitidos. |
| **Credenciales fuera del repo** | Variables sensibles en `.env` (excluido por `.gitignore`). |
| **Límite de payload** | `express.json({ limit: '10kb' })` evita payloads maliciosos enormes. |
| **Restricción UNIQUE en BD** | Garantía a nivel de motor: el email no puede duplicarse. |

---

## 🚨 Manejo de errores

Manejo centralizado en `src/middlewares/errorHandler.js`. Todos los errores devuelven un JSON consistente:

| Código | Significado              | Caso de ejemplo                              |
|--------|--------------------------|----------------------------------------------|
| `200`  | OK                       | Operación exitosa                            |
| `201`  | Created                  | Cliente creado                               |
| `400`  | Bad Request              | Email mal formado, ID no numérico            |
| `404`  | Not Found                | Cliente con ID inexistente, ruta no definida |
| `409`  | Conflict                 | Email ya registrado                          |
| `429`  | Too Many Requests        | Excedió el rate limit                        |
| `500`  | Internal Server Error    | Error inesperado del servidor                |
| `503`  | Service Unavailable      | Base de datos caída                          |

---

## 🧪 Pruebas con Postman

En la carpeta `postman/` se incluye la colección **`ClientesAPI.postman_collection.json`** con **12 pruebas** que cubren todos los casos exitosos y de error.

### Importar en Postman:
1. Abrir Postman → **Import** → arrastra el archivo `.json`.
2. Verifica que la variable `baseUrl` apunte a `http://localhost:3000`.
3. Ejecuta las peticiones en orden para validar toda la API.

### Pruebas incluidas:
1. ✅ Listar todos los clientes (200)
2. ✅ Obtener cliente por ID (200)
3. ✅ Obtener cliente inexistente (404)
4. ✅ Obtener con ID inválido (400)
5. ✅ Crear cliente (201)
6. ✅ Crear con email duplicado (409)
7. ✅ Crear con datos inválidos (400)
8. ✅ Crear sin campos obligatorios (400)
9. ✅ Actualizar cliente (200)
10. ✅ Actualizar inexistente (404)
11. ✅ Eliminar cliente (200)
12. ✅ Eliminar inexistente (404)

---

## 🗂️ Estructura del proyecto

```
api-clientes/
├── src/
│   ├── config/
│   │   └── database.js              # Pool de conexión MySQL
│   ├── controllers/
│   │   └── cliente.controller.js    # Lógica HTTP
│   ├── models/
│   │   └── cliente.model.js         # Acceso a datos (consultas parametrizadas)
│   ├── middlewares/
│   │   ├── errorHandler.js          # Manejo central de errores
│   │   └── notFound.js              # 404 para rutas no definidas
│   ├── validators/
│   │   └── cliente.validator.js     # Reglas express-validator
│   ├── routes/
│   │   └── cliente.routes.js        # Definición de rutas REST
│   ├── utils/
│   │   ├── ApiError.js              # Clase de error personalizada
│   │   └── asyncHandler.js          # Wrapper async para controllers
│   └── app.js                       # Configuración de Express
├── database/
│   └── schema.sql                   # Script de creación de BD
├── postman/
│   └── ClientesAPI.postman_collection.json
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore
├── package.json
├── server.js                        # Punto de entrada
└── README.md
```

### Arquitectura por capas

```
   Request HTTP
        ↓
   ┌─────────────┐
   │   ROUTES    │  ←  Define las rutas y orquesta middlewares
   └─────────────┘
        ↓
   ┌─────────────┐
   │ VALIDATORS  │  ←  Valida la entrada (express-validator)
   └─────────────┘
        ↓
   ┌─────────────┐
   │ CONTROLLERS │  ←  Lógica HTTP (status codes, formato JSON)
   └─────────────┘
        ↓
   ┌─────────────┐
   │   MODELS    │  ←  Acceso a la BD (consultas parametrizadas)
   └─────────────┘
        ↓
       MySQL
```

---

## 🛠️ Tecnologías utilizadas

| Paquete                | Uso                                             |
|------------------------|-------------------------------------------------|
| `express`              | Framework web                                   |
| `mysql2`               | Driver MySQL con soporte de promesas            |
| `express-validator`    | Validación de entradas                          |
| `helmet`               | Cabeceras HTTP de seguridad                     |
| `cors`                 | Control de orígenes cruzados                    |
| `express-rate-limit`   | Limitador de peticiones                         |
| `morgan`               | Logging de peticiones HTTP                      |
| `dotenv`               | Carga de variables de entorno                   |
| `nodemon` (dev)        | Recarga automática en desarrollo                |

---

## 👤 Autor

Trabajo individual — Asignatura **CIB302 Taller de Plataformas Web** — AIEP — 2025.

## 📄 Licencia

Distribuido bajo licencia MIT.
