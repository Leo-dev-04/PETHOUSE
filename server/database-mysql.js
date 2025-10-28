// ========================================
//   CONFIGURACIÓN DE BASE DE DATOS MYSQL
// ========================================

const { Sequelize } = require('sequelize');

// Configuración de la conexión
const sequelize = new Sequelize(
    process.env.DB_NAME || 'pethouse_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        
        // Configuraciones de pool para mejor rendimiento
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        
        // Configuración de logging
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        
        // Configuración de zona horaria
        timezone: '-06:00',
        
        // Opciones adicionales
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    }
);

// Función para conectar a la base de datos
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('🗄️  MySQL Conectado exitosamente');
        console.log(`📊 Base de datos: ${sequelize.config.database}`);
        console.log(`🌐 Host: ${sequelize.config.host}:${sequelize.config.port}`);
        
        // Sincronizar modelos en desarrollo
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('🔄 Modelos sincronizados con la base de datos');
        }
        
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        
        // Si no se puede conectar a MySQL, usar datos en memoria para desarrollo
        console.log('⚠️  Usando modo desarrollo sin MySQL');
        global.useMockData = true;
    }
};

// Manejar cierre graceful
process.on('SIGINT', async () => {
    try {
        await sequelize.close();
        console.log('👋 Conexión MySQL cerrada');
        process.exit(0);
    } catch (error) {
        console.error('Error cerrando conexión:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        await sequelize.close();
        console.log('👋 Conexión MySQL cerrada');
        process.exit(0);
    } catch (error) {
        console.error('Error cerrando conexión:', error);
        process.exit(1);
    }
});

module.exports = { sequelize, connectDB };