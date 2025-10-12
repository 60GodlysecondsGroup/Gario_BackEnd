
<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="120" alt="Node.js Logo"/>
</p>

<h1 align="center">💰 Gario — Backend de Gestión Financiera</h1>

<p align="center">
  <b>Backend en Node.js para registrar y consultar ingresos, gastos y reportes financieros personales.</b><br/>
  <sub>Desarrollado con <b>Node.js + Express + MySQL + JWT</b></sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Estado-En%20Desarrollo-yellow?style=for-the-badge&logo=github&logoColor=black"/>
</p>

---

## ⚙️ Configuración Inicial

### 1️⃣ Instalación del entorno

```bash
git clone https://github.com/60GodlysecondsGroup/Gario_BackEnd.git
cd Gario_BackEnd
npm install
```

### 2️⃣ Variables de entorno (`.env`)

```ini
PORT=3000

# --- Base de Datos ---
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mi_contraseña
DB_NAME=gario_db
DB_PORT=3306

# --- JWT ---
JWT_SECRET=mi_clave_secreta
JWT_EXPIRES_IN=1h
```

### 3️⃣ Abrir el Puerto 3000 (Opcional en Windows)

* Abrir **PowerShell** como administrador y ejecutar:

```powershell
New-NetFirewallRule -DisplayName "Abrir Puerto 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### 4️⃣ Ejecución del proyecto

```bash
node server.js
```

Backend disponible en:
`http://localhost:3000`

Prueba rápida:

```bash
GET http://localhost:3000/ping
```

---

## 🧠 Estructura del Proyecto

```
Gario_BackEnd/
├── controllers/
│   ├── auth.controller.js
│   ├── catalogo.controller.js
│   └── movimiento.controller.js
├── middlewares/
│   ├── verifytoken.js
│   └── validate.js
├── routes/
│   ├── auth.routes.js
│   ├── catalogo.routes.js
│   └── movimiento.routes.js
├── services/
│   ├── auth.service.js
│   ├── catalogo.service.js
│   └── movimiento.service.js
├── validations/
│   ├── auth.schema.js
│   └── movimiento.schema.js
├── DATABASE/
│   └── Connect.js
├── server.js
└── .env
```

---

## 🛠 Arquitectura Visual

```
Client -> [Rutas] -> [Controladores] -> [Servicios] -> [MySQL]
           |             |                 |
           |             |                 --> auth.service.js
           |             |                 --> catalogo.service.js
           |             |                 --> movimiento.service.js
           |             |
           |             --> auth.controller.js
           |             --> catalogo.controller.js
           |             --> movimiento.controller.js
           |
           --> Middlewares:
                 - verifytoken.js
                 - validate.js
```

---

## 🚪 Rutas de la Aplicación

```
/auth
 ├─ POST   /register       🔑 Registro de usuarios
 ├─ POST   /login          🔑 Login de usuarios
 ├─ POST   /logout         🔑 Cierre de sesión
 └─ GET    /me             🔑 Obtener datos del usuario logueado

/catalogo
 ├─ GET    /tipos          📚 Listado de tipos de ingresos/gastos
 ├─ GET    /categorias     📚 Listado de categorías
 └─ GET    /metodos-pago   📚 Métodos de pago disponibles

/movimiento
 ├─ POST   /ingreso        💸 Registrar ingreso
 ├─ POST   /gasto          💸 Registrar gasto
 ├─ GET    /historial      💸 Consultar historial completo
 ├─ GET    /monto          💸 Obtener montos totales
 ├─ GET    /reporte/dia    💸 Reporte por día
 ├─ GET    /reporte/semana 💸 Reporte por semana
 ├─ GET    /reporte/mes    💸 Reporte por mes
 └─ GET    /reporte/anio   💸 Reporte por año
```

**Middlewares aplicados a las rutas**:

* 🛡 `verifytoken.js` → Protege rutas que requieren autenticación
* 📏 `validate.js` → Valida los datos de entrada según los schemas de Joi

---

## 🧰 Servicios

| Archivo                   | Función                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **auth.service.js**       | Registro, login, cifrado de contraseñas y tokens JWT.                                  |
| **catalogo.service.js**   | Obtención de catálogos de ingresos/gastos y métodos de pago.                           |
| **movimiento.service.js** | Registro de movimientos, historial y reportes diarios, semanales, mensuales y anuales. |

---

## 🎮 Controladores

| Archivo                      | Función                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| **auth.controller.js**       | Gestiona rutas de autenticación: registro, login, logout, verificación JWT. |
| **catalogo.controller.js**   | Controla rutas para obtener catálogos de la app.                            |
| **movimiento.controller.js** | Gestiona rutas de movimientos financieros y reportes.                       |

---

## 🛡 Middlewares

| Middleware         | Función                                                |
| ------------------ | ------------------------------------------------------ |
| **verifytoken.js** | Verifica la validez del token JWT en rutas protegidas. |
| **validate.js**    | Valida los datos de entrada con **Joi**.               |

---

## ✅ Validaciones

| Archivo                  | Función                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| **auth.schema.js**       | Reglas de validación para registro y login de usuarios.                  |
| **movimiento.schema.js** | Reglas de validación para movimientos, consultas y filtros de historial. |

---

## 🚀 Servidor Principal

```js
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import catalogoRoutes from "./routes/catalogo.routes.js";
import movimientoRoutes from "./routes/movimiento.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/catalogo", catalogoRoutes);
app.use("/movimiento", movimientoRoutes);

// Endpoint de prueba
app.get("/ping", (req, res) => res.send("Pong"));

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
```

---

## 📦 Dependencias

| Paquete          | Función                              |
| ---------------- | ------------------------------------ |
| **express**      | Framework para crear endpoints REST. |
| **mysql2**       | Cliente MySQL para Node.js.          |
| **bcryptjs**     | Cifrado de contraseñas.              |
| **jsonwebtoken** | Gestión de JWT para autenticación.   |
| **joi**          | Validación de datos de entrada.      |
| **multer**       | Manejo de archivos.                  |
| **cors**         | Configuración de CORS.               |
| **dotenv**       | Variables de entorno.                |
| **uuid**         | Identificadores únicos.              |

---

## 📘 Estado del Proyecto

* **Versión:** 1.0.0
* **Estado:** En desarrollo
* **Objetivo:** Backend funcional para gestión financiera, con autenticación, registro de movimientos y reportes.

---

## 👨‍💻 Autores

* **Cristian Valderrama** 🌐 [GitHub: bskcfv](https://github.com/bskcfv) – Desarrollo completo del backend, servicios, controladores y rutas principales.
* **Juan Aponte** 🌐 [GitHub: JuanesUNI-Dev](https://github.com/JuanesUNI-Dev) – Implementación del endpoint `/ping` y pruebas iniciales del servidor.

