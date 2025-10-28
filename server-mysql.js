// ========================================
//   SERVIDOR PRINCIPAL PETHOUSE - MYSQL
// ========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./server/database-mysql');

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a la base de datos MySQL
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Headers de seguridad básicos
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});

// ========================================
//   RUTAS API
// ========================================

// Importar rutas MySQL (las crearemos después)
const authRoutes = require('./server/routes-mysql/auth');
const mascotaRoutes = require('./server/routes-mysql/mascotas');
const organizacionRoutes = require('./server/routes-mysql/organizaciones');
const adopcionRoutes = require('./server/routes-mysql/adopciones');
const adminRoutes = require('./server/routes-mysql/admin');

// Usar rutas API
app.use('/api/auth', authRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/organizaciones', organizacionRoutes);
app.use('/api/adopciones', adopcionRoutes);
app.use('/api/admin', adminRoutes);

// ========================================
//   RUTAS DE PÁGINAS
// ========================================

// Ruta principal - redirigir a index
app.get('/', (req, res) => {
    res.redirect('/pages/index.html');
});

// Servir páginas HTML desde public/pages
app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'public', 'pages', page);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
        }
    });
});

// ========================================
//   API DE PRUEBA Y ESTADO
// ========================================

// Estado del servidor
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: global.useMockData ? 'Mock Data' : 'MySQL',
        version: '1.0.0'
    });
});

// Información básica de la API
app.get('/api', (req, res) => {
    res.json({
        message: 'PETHOUSE API v1.0 - MySQL Edition',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            mascotas: '/api/mascotas',
            organizaciones: '/api/organizaciones',
            adopciones: '/api/adopciones'
        },
        database: 'MySQL with Sequelize ORM',
        documentation: 'https://pethouse.com/api/docs'
    });
});

// ========================================
//   MANEJO DE ERRORES
// ========================================

// Middleware de manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.originalUrl} no existe`,
        timestamp: new Date().toISOString()
    });
});

// Middleware de manejo de errores generales
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    
    // Manejar errores de Sequelize
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Datos inválidos',
            detalles: err.errors.map(e => e.message),
            timestamp: new Date().toISOString()
        });
    }
    
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            error: 'Datos duplicados',
            message: 'Ya existe un registro con estos datos',
            timestamp: new Date().toISOString()
        });
    }
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : err.message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// ========================================
//   INICIAR SERVIDOR
// ========================================

const server = app.listen(PORT, () => {
    console.log('🚀 ========================================');
    console.log('🏠   PETHOUSE SERVIDOR MYSQL INICIADO');
    console.log('🚀 ========================================');
    console.log(`📡 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🌐 URL Local: http://localhost:${PORT}`);
    console.log(`📱 API Base: http://localhost:${PORT}/api`);
    console.log(`🏠 Páginas: http://localhost:${PORT}/pages/index.html`);
    console.log(`🗄️  Base de datos: MySQL con Sequelize ORM`);
    console.log('🚀 ========================================');
});

// Manejo graceful de cierre
process.on('SIGTERM', () => {
    console.log('👋 Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado exitosamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('👋 Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado exitosamente');
        process.exit(0);
    });
});

module.exports = app;