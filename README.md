# Como inicializar el proyecto – Aplicación web TFG (Clubes y Profesores de Pádel/Tenis)

Este documento resume el proceso de inicialización y configuración del proyecto, incluyendo backend, frontend, base de datos y control de versiones, con explicaciones breves para cada herramienta y comando utilizado.

---

## 1. Estructura del proyecto

```
tfg-padel/
├── backend/     ← API REST con Express + Prisma
└── frontend/    ← Interfaz de usuario con React
```

## 2. Backend – Express + Prisma + SQLite

### Inicializar proyecto Node.js

```bash
cd backend
npm init -y
```

### Instalar dependencias principales

```bash
npm install express prisma @prisma/client bcryptjs cors dotenv
```

> - `express`: servidor HTTP del backend  
> - `prisma`: ORM para acceso a base de datos  
> - `bcryptjs`: encriptación de contraseñas  
> - `cors`, `dotenv`: configuración adicional

### 2.2. Inicializar Prisma

```bash
npx prisma init
```

### Configurar base de datos SQLite

En el archivo `.env` (dentro de `backend/`):

```env
DATABASE_URL="file:./dev.db"
```
### Ejecutar migraciones

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🎨 3. Frontend – React

### Crear proyecto con Create React App

```bash
npx create-react-app frontend
```

### Instalar librerías necesarias

```bash
cd frontend
npm install axios react-router-dom
```

> - `axios`: permite hacer llamadas HTTP al backend  
> - `react-router-dom`: navegación entre páginas del frontend

### Configurar variable de entorno para llamadas a la API

En el archivo `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3000
```

> Define la dirección del backend para realizar peticiones desde React.

