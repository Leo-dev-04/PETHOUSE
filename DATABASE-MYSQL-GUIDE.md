# 🗄️ **Base de Datos MySQL - PETHOUSE**

## **📋 Información General**

La base de datos MySQL de PETHOUSE está diseñada para manejar todo el flujo de adopción de mascotas, desde el registro de usuarios y organizaciones hasta el seguimiento completo del proceso de adopción.

## **🏗️ Estructura de la Base de Datos**

### **Tablas Principales:**

1. **`usuarios`** - Datos de personas que quieren adoptar
2. **`organizaciones`** - Refugios, fundaciones y centros de rescate
3. **`mascotas`** - Información completa de animales disponibles
4. **`solicitudadopcions`** - Seguimiento del proceso de adopción

---

## **🚀 Configuración Inicial**

### **1. Prerrequisitos**
```bash
# Instalar MySQL 8.0+
# Crear base de datos llamada 'pethouse'
# Configurar variables de entorno
```

### **2. Variables de Entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
# Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pethouse
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# Autenticación
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=7d

# Servidor
PORT=5000
NODE_ENV=development
```

### **3. Instalar Dependencias**
```bash
npm install
```

### **4. Crear y Poblar Base de Datos**
```bash
# Crear tablas y datos de prueba
npm run db:seed
```

---

## **🎯 Comandos Disponibles**

### **Desarrollo**
```bash
npm run server:dev    # Servidor con auto-recarga
npm run dev          # Frontend con live-server
```

### **Producción**
```bash
npm run server       # Servidor de producción
```

### **Base de Datos**
```bash
npm run db:seed      # Poblar base de datos con datos de prueba
```

---

## **🔧 Estructura de Modelos**

### **Usuario**
```javascript
{
  id: Integer (Primary Key),
  nombreCompleto: String,
  email: String (Unique),
  password: String (Hashed),
  telefono: String,
  fechaNacimiento: Date,
  ubicacion: JSON,
  experienciaConMascotas: Text,
  tipoVivienda: Enum,
  verificado: Boolean,
  fechaRegistro: Date
}
```

### **Organización**
```javascript
{
  id: Integer (Primary Key),
  nombreOrganizacion: String,
  tipoOrganizacion: Enum,
  descripcion: Text,
  email: String (Unique),
  password: String (Hashed),
  telefono: String,
  ubicacion: JSON,
  servicios: JSON,
  horarioAtencion: JSON,
  verificada: Boolean,
  activa: Boolean,
  estadisticas: JSON,
  fechaRegistro: Date
}
```

### **Mascota**
```javascript
{
  id: Integer (Primary Key),
  nombre: String,
  tipo: Enum,
  raza: String,
  edad: Integer,
  sexo: Enum,
  tamaño: Enum,
  peso: Float,
  color: String,
  descripcion: Text,
  personalidad: JSON,
  necesidadesEspeciales: Text,
  estado: Enum,
  esterilizado: Boolean,
  vacunas: JSON,
  historialMedico: Text,
  organizacionId: Integer (Foreign Key),
  imagenes: JSON,
  imagenPrincipal: String,
  fechaIngreso: Date,
  fechaRescate: Date,
  fechaAdopcion: Date
}
```

### **Solicitud de Adopción**
```javascript
{
  id: Integer (Primary Key),
  usuarioId: Integer (Foreign Key),
  mascotaId: Integer (Foreign Key),
  organizacionId: Integer (Foreign Key),
  estado: Enum,
  tipoVivienda: String,
  experienciaMascotas: Text,
  motivoAdopcion: Text,
  disponibilidadTiempo: Text,
  contactoEmergencia: JSON,
  comentariosAdicionales: Text,
  comentarios: Text,
  fechaSolicitud: Date,
  fechaActualizacion: Date
}
```

---

## **🌐 Endpoints de la API**

### **Autenticación** (`/api/auth`)
- `POST /registro` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `POST /registro-organizacion` - Registrar organización

### **Mascotas** (`/api/mascotas`)
- `GET /` - Listar mascotas (con filtros)
- `GET /:id` - Obtener mascota específica
- `GET /buscar/:termino` - Buscar mascotas
- `GET /stats/general` - Estadísticas generales

### **Organizaciones** (`/api/organizaciones`)
- `GET /` - Listar organizaciones
- `GET /:id` - Obtener organización específica
- `GET /:id/mascotas` - Mascotas de una organización
- `GET /mapa/ubicaciones` - Organizaciones para mapa
- `GET /buscar/:termino` - Buscar organizaciones

### **Adopciones** (`/api/adopciones`)
- `GET /` - Listar solicitudes
- `POST /` - Crear nueva solicitud
- `GET /:id` - Obtener solicitud específica
- `PATCH /:id/estado` - Actualizar estado de solicitud
- `GET /usuario/:usuarioId` - Solicitudes de un usuario
- `GET /organizacion/:organizacionId` - Solicitudes de una organización
- `GET /stats/general` - Estadísticas de adopciones

---

## **🔍 Características Especiales**

### **Modo Sin Base de Datos**
El sistema puede funcionar con datos mock si MySQL no está disponible:
```javascript
// Se activa automáticamente si no puede conectar a MySQL
global.useMockData = true;
```

### **Filtros Avanzados**
```javascript
// Ejemplo: Buscar mascotas
GET /api/mascotas?tipo=perro&tamaño=grande&edad_min=1&edad_max=5

// Ejemplo: Organizaciones con mascotas
GET /api/organizaciones?conMascotas=true&ciudad=México
```

### **Geolocalización**
```javascript
// Coordenadas para mapas interactivos
{
  ubicacion: {
    coordenadas: {
      latitud: 19.4326,
      longitud: -99.1332
    }
  }
}
```

---

## **🎨 Datos de Prueba Incluidos**

### **Usuarios (3):**
- Juan Pérez González (verificado)
- Ana Rodríguez López (verificado) 
- Carlos García Mendoza (no verificado)

### **Organizaciones (3):**
- Fundación Patitas Felices (verificada)
- Refugio Esperanza (verificada)
- Gatitos Sin Hogar MTY (no verificada)

### **Mascotas (6):**
- Luna (Golden Retriever) - disponible
- Max (Pastor Alemán) - disponible
- Mía (Siamés) - disponible
- Rocky (Pitbull) - en proceso de adopción
- Whiskers (Gato mestizo) - disponible
- Bella (Labrador) - adoptado

### **Solicitudes (3):**
- Rocky → Juan Pérez (aprobada)
- Luna → Ana Rodríguez (pendiente)
- Mía → Carlos García (en revisión)

---

## **⚡ Pruebas Rápidas**

### **Verificar Funcionamiento:**
```bash
# 1. Iniciar servidor
npm run server:dev

# 2. Probar endpoints
curl http://localhost:5000/api/mascotas
curl http://localhost:5000/api/organizaciones
curl http://localhost:5000/api/adopciones/stats/general
```

### **Probar Frontend:**
```bash
# 1. Iniciar frontend
npm run dev

# 2. Visitar:
# http://localhost:3000/pages/index.html
# http://localhost:3000/pages/adopciones.html
# http://localhost:3000/pages/mapa-organizaciones.html
```

---

## **🛠️ Troubleshooting**

### **Error de Conexión MySQL:**
```bash
# Verificar que MySQL esté corriendo
# Verificar credenciales en .env
# Verificar que existe la base de datos 'pethouse'
```

### **Tablas No Creadas:**
```bash
# Ejecutar seeding que crea tablas automáticamente
npm run db:seed
```

### **Datos No Aparecen:**
```bash
# Verificar que el seeding se ejecutó correctamente
# Revisar logs del servidor para errores de conexión
```

---

## **📊 Próximos Pasos**

1. **Conectar con MySQL Workbench** para administración visual
2. **Configurar backups automáticos** de la base de datos
3. **Implementar índices** para optimizar consultas
4. **Agregar validaciones** adicionales en el frontend
5. **Implementar notificaciones** por email/SMS

---

**✅ ¡La base de datos MySQL de PETHOUSE está lista para usar!**