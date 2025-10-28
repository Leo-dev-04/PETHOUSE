// ========================================
//   SCRIPT DE VERIFICACIÓN MYSQL
// ========================================

const mysql = require('mysql2/promise');
require('dotenv').config();

async function verificarMySQL() {
    console.log('🔍 ========================================');
    console.log('🔍   VERIFICACIÓN DE MYSQL - PETHOUSE');
    console.log('🔍 ========================================');
    
    // Mostrar configuración
    console.log('📋 Configuración actual:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Puerto: ${process.env.DB_PORT || '3306'}`);
    console.log(`   Usuario: ${process.env.DB_USER || 'root'}`);
    console.log(`   Base de datos: ${process.env.DB_NAME || 'pethouse'}`);
    console.log(`   Contraseña: ${process.env.DB_PASSWORD ? '***configurada***' : '❌ NO CONFIGURADA'}`);
    console.log('');

    let connection;

    try {
        // Paso 1: Conectar a MySQL (sin base de datos específica)
        console.log('🔗 Paso 1: Conectando a MySQL...');
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('✅ Conexión a MySQL exitosa');

        // Paso 2: Verificar versión de MySQL
        console.log('📊 Paso 2: Verificando versión de MySQL...');
        
        const [versionRows] = await connection.execute('SELECT VERSION() as version');
        console.log(`✅ MySQL versión: ${versionRows[0].version}`);

        // Paso 3: Verificar si existe la base de datos
        console.log('🗄️  Paso 3: Verificando base de datos...');
        
        const dbName = process.env.DB_NAME || 'pethouse';
        const [dbRows] = await connection.execute(
            'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
            [dbName]
        );

        if (dbRows.length > 0) {
            console.log(`✅ Base de datos '${dbName}' existe`);
            
            // Paso 4: Conectar a la base de datos específica
            await connection.changeUser({ database: dbName });
            console.log(`✅ Conectado a la base de datos '${dbName}'`);

            // Paso 5: Verificar tablas
            console.log('📋 Paso 5: Verificando tablas...');
            
            const [tableRows] = await connection.execute('SHOW TABLES');
            
            if (tableRows.length > 0) {
                console.log(`✅ Encontradas ${tableRows.length} tablas:`);
                tableRows.forEach(row => {
                    const tableName = Object.values(row)[0];
                    console.log(`   - ${tableName}`);
                });

                // Paso 6: Contar registros en cada tabla
                console.log('📊 Paso 6: Contando registros...');
                
                for (const row of tableRows) {
                    const tableName = Object.values(row)[0];
                    try {
                        const [countRows] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
                        const count = countRows[0].count;
                        console.log(`   ${tableName}: ${count} registros`);
                    } catch (error) {
                        console.log(`   ${tableName}: Error contando registros`);
                    }
                }
            } else {
                console.log('⚠️  No se encontraron tablas. Ejecuta: npm run db:seed');
            }

        } else {
            console.log(`❌ Base de datos '${dbName}' NO existe`);
            console.log('🔧 Para crearla, ejecuta:');
            console.log(`   CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        }

        console.log('');
        console.log('🎉 ========================================');
        console.log('🎉   VERIFICACIÓN COMPLETADA');
        console.log('🎉 ========================================');

        if (dbRows.length > 0) {
            console.log('✅ MySQL está configurado correctamente');
            console.log('✅ Puedes ejecutar: npm run server');
        } else {
            console.log('⚠️  Necesitas crear la base de datos primero');
            console.log('📋 Sigue la guía en: MYSQL-SETUP-GUIDE.md');
        }

    } catch (error) {
        console.log('');
        console.log('❌ ========================================');
        console.log('❌   ERROR DE CONEXIÓN');
        console.log('❌ ========================================');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('🚫 MySQL no está corriendo');
            console.log('🔧 Soluciones:');
            console.log('   - Si usas XAMPP: Inicia MySQL desde el panel');
            console.log('   - Si usas MySQL Server: Verifica el servicio "MySQL80"');
            console.log('   - Verifica que el puerto 3306 esté disponible');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('🔐 Credenciales incorrectas');
            console.log('🔧 Soluciones:');
            console.log('   - Verifica DB_USER y DB_PASSWORD en .env');
            console.log('   - Intenta conectarte con MySQL Workbench primero');
            console.log('   - Si usas XAMPP, la contraseña suele ser vacía');
        } else {
            console.log(`🚫 Error: ${error.message}`);
            console.log(`🔍 Código: ${error.code}`);
        }
        
        console.log('');
        console.log('📚 Consulta la guía completa en: MYSQL-SETUP-GUIDE.md');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar verificación
if (require.main === module) {
    verificarMySQL()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error fatal:', error.message);
            process.exit(1);
        });
}

module.exports = { verificarMySQL };