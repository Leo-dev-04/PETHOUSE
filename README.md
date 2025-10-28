# PETHOUSE - Frontend

Este repositorio contiene el frontend del proyecto PETHOUSE.

Estructura principal:

- `public/` — archivos estáticos (HTML, CSS, JS, imágenes).
- `server/` — backend (no se despliega en Netlify). 

Cómo publicar en Netlify (rápido):

1. Subir la carpeta `public/` en Netlify (Deploy -> Drag and drop) o conectar este repo y establecer `publish directory` a `public`.
2. Para SPAs, añade `public/_redirects` con `/* /index.html 200`.

Cómo empujar a GitHub:

1. Inicializa el repositorio localmente: `git init`.
2. `git add .` y `git commit -m "Initial commit"`.
3. Crear repo remoto en GitHub y `git remote add origin <url>`; luego `git push -u origin main`.

Si quieres, puedo crear el repo en GitHub por ti (necesitaré tu aprobación para usar `gh` o instrucciones para acceder a tu cuenta).
# 🏠 PETHOUSE - Proyecto Reorganizado

## 📁 Estructura del Proyecto

```
📦 PETHOUSE/
├── 📁 public/              # Archivos servidos al cliente
│   ├── 📁 pages/           # Páginas HTML organizadas
│   ├── 📁 assets/          # Recursos estáticos
│   │   ├── 📁 images/      # Imágenes optimizadas
│   │   └── 📁 icons/       # Iconos del sitio
│   ├── � *.css            # Estilos modulares
│   ├── � *.js             # Scripts funcionales
│   └── � server-tienda.js # Servidor Node.js
├── � package.json         # Configuración del proyecto
├── � production-config.json # Configuración de producción
└── 📄 README.md           # Este archivo
```

## 🚀 Comandos de Desarrollo

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev        # Servidor de desarrollo con live-reload
npm start          # Alias para npm run dev
npm run tienda     # Servidor de tienda (producción)
npm run tienda:dev # Servidor de tienda (desarrollo con nodemon)
```

## 🔧 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables y grid/flexbox
- **JavaScript ES6+** - Funcionalidad interactiva
- **Node.js** - Servidor backend básico
- **Live Server** - Desarrollo con recarga automática
- **Nodemon** - Desarrollo backend con recarga automática

## � Páginas del Proyecto

### Públicas
- **index.html** - Página principal
- **nosotros.html** - Información de la empresa
- **servicios.html** - Servicios ofrecidos
- **galeria.html** - Galería de fotos
- **contacto.html** - Formulario de contacto

### Funcionales
- **adopciones.html** - Catálogo de mascotas
- **adopcion-express.html** - Proceso rápido de adopción
- **proceso-adopcion.html** - Proceso completo de adopción y perfil de mascota
- **login.html** - Inicio de sesión
- **registro.html** - Registro de usuarios
- **registro-organizacion.html** - Registro de organizaciones
- **dashboard.html** - Panel de administración
- **tienda.html** - E-commerce de productos para mascotas

## 📈 Características Implementadas

### ✅ Frontend Completo
- Diseño responsive y moderno
- Sistema de navegación fluido
- Formularios con validación
- Galería interactiva de mascotas
- E-commerce básico funcional

### ✅ Backend Básico
- Servidor Node.js para tienda
- Manejo de archivos estáticos
- API REST básica

### ✅ Experiencia de Usuario
- Carga rápida de páginas
- Interfaz intuitiva
- Formularios user-friendly
- Proceso de adopción simplificado

## 🎯 Próximos Pasos (Opcionales)

1. **Base de Datos**: Conectar con MongoDB o MySQL
2. **Autenticación**: Sistema de login real con JWT
3. **API REST**: Endpoints completos para adopciones
4. **PWA**: Service workers para funcionalidad offline
5. **Testing**: Pruebas automatizadas con Jest

## 🚀 ¿Cómo usar?

1. **Clonar/Descargar** el proyecto
2. **Instalar dependencias**: `npm install`
3. **Servidor de desarrollo**: `npm run dev`
4. **Servidor de tienda**: `npm run tienda:dev`
5. **Abrir**: http://localhost:3000

## 👥 Contribución

Para contribuir al proyecto:
1. Mantener la estructura actual simple
2. Seguir las convenciones de nomenclatura
3. Probar en múltiples navegadores
4. Documentar cambios importantes

---

**PETHOUSE** - Plataforma de adopción de mascotas desarrollada con amor 🐕❤️🐱