# 🎨 IvoiviArt

> Plataforma web moderna de galería de arte con e-commerce integrado

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21.2-green.svg)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10.0-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Deploy](#-deploy)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

- 🎨 **Galería interactiva** con carruseles responsivos
- 🛒 **E-commerce integrado** con MercadoPago
- 🔥 **Firebase** para autenticación y base de datos
- 📱 **Diseño responsive** optimizado para todos los dispositivos
- ⚡ **Lazy loading** de imágenes para mejor performance
- 🎭 **Animaciones fluidas** con Framer Motion
- 🔍 **SEO optimizado**
- 📧 **Sistema de contacto** con EmailJS
- 🌐 **Backend REST API** con Express
- 🎯 **TypeScript** para type safety

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library
- **React Lazy Load** - Image optimization

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Services
- **Firebase** - Authentication & Database
- **MercadoPago** - Payment gateway
- **EmailJS** - Email service
- **Netlify Functions** - Serverless functions

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x
- **npm** >= 9.x (o **yarn** / **pnpm**)
- **Git**

Verifica las versiones:
```bash
node --version
npm --version
git --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ivoiviart.git
cd ivoiviart
```

### 2. Instalar dependencias

```bash
npm install
```

O si usas yarn:
```bash
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

---

## ⚙️ Configuración

### Variables de Entorno

Edita el archivo `.env` con tus credenciales:

```env
# Firebase
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# MercadoPago
VITE_MP_PUBLIC_KEY=tu_public_key
MP_ACCESS_TOKEN=tu_access_token

# EmailJS
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key

# Backend
PORT=3000
NODE_ENV=development
```

### Firebase Setup

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication (Email/Password)
4. Crea una Firestore Database
5. Copia las credenciales al `.env`

### MercadoPago Setup

1. Crea una cuenta en [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Genera tus credenciales de prueba/producción
3. Agrégalas al `.env`

---

## 💻 Uso

### Desarrollo

Para trabajar en el proyecto localmente, necesitas levantar **frontend** y **backend** por separado:

#### Opción 1: Dos terminales (recomendado)

**Terminal 1 - Backend:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Opción 2: Un solo comando (requiere concurrently)

```bash
npm install -D concurrently
npm run dev:full
```

El proyecto estará disponible en:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

### Producción

#### 1. Compilar el proyecto

```bash
# Compilar frontend
npm run build

# Compilar backend
npm run build:api
```

#### 2. Iniciar servidor de producción

```bash
npm start
```

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia Vite dev server (frontend) |
| `npm run dev:api` | Inicia backend en modo desarrollo con hot-reload |
| `npm run build` | Compila el frontend para producción |
| `npm run build:api` | Compila el backend TypeScript |
| `npm run preview` | Preview de la build de producción |
| `npm start` | Inicia servidor de producción |
| `npm run start:api` | Inicia backend compilado |

---

## 📁 Estructura del Proyecto

```
ivoiviart/
├── src/
│   ├── assets/              # Imágenes, fuentes, etc.
│   ├── components/          # Componentes React reutilizables
│   │   ├── Card.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Home.tsx
│   │   ├── Product.tsx
│   │   └── ...
│   ├── services/           # Servicios y lógica de negocio
│   │   ├── media.ts
│   │   ├── firebase.ts
│   │   └── ...
│   ├── server.ts           # Backend Express
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globales
├── dist/                   # Build de producción
├── public/                 # Archivos estáticos
│   └── img/               # Imágenes públicas
├── dataconnect-generated/  # Firebase Data Connect
├── .env                    # Variables de entorno (no subir a git)
├── .env.example            # Ejemplo de variables de entorno
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración TypeScript (frontend)
├── tsconfig.node.json      # Configuración TypeScript (backend)
├── vite.config.ts          # Configuración Vite
├── tailwind.config.js      # Configuración Tailwind
└── README.md              # Este archivo
```

---

## 🌐 API Endpoints

### Backend Express (localhost:3000)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check del servidor |
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/checkout` | Crear preferencia de pago |
| POST | `/api/contact` | Enviar formulario de contacto |

### Ejemplo de uso

```javascript
// Obtener productos
const response = await fetch('http://localhost:3000/api/products');
const products = await response.json();

// Crear checkout
const response = await fetch('http://localhost:3000/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{ id: '1', title: 'Obra', price: 1000, quantity: 1 }]
  })
});
```

---

## 🚀 Deploy

### Netlify (Recomendado)

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno en Netlify
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Vercel

```bash
npm install -g vercel
vercel
```

### Render

1. Crea un nuevo Web Service
2. Conecta el repositorio
3. Build command: `npm run build`
4. Start command: `npm start`

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad increíble'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Formateo de código
- `refactor:` Refactorización de código
- `test:` Agregar tests
- `chore:` Tareas de mantenimiento

---

## 🐛 Troubleshooting

### Error: Cannot find module 'dist/server.js'

**Solución:** Compilar el backend primero
```bash
npm run build:api
```

### Puerto 3000 ya en uso

**Solución:** Cambiar el puerto en `.env`
```env
PORT=3001
```

### Error de CORS

**Solución:** Verificar que el backend esté corriendo y las URLs en el frontend sean correctas

### Imágenes no cargan

**Solución:** Verificar que las rutas en `/public/img/` existan y sean correctas

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Email: tu@email.com

---

## 🙏 Agradecimientos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [MercadoPago](https://www.mercadopago.com.ar/)

---

## 📊 Estado del Proyecto

🚧 **En desarrollo activo** - v0.0.0

---

<div align="center">
  <p>Hecho con ❤️ por el equipo de IvoiviArt</p>
  <p>⭐ Si te gusta el proyecto, dale una estrella en GitHub!</p>
</div>