# 🚀 **Instalación Rápida MySQL - PETHOUSE**

## **⚡ Pasos Rápidos (5 minutos)**

### **1. 📥 Instalar MySQL**
```bash
# Opción A: Descargar MySQL
# https://dev.mysql.com/downloads/mysql/

# Opción B: Instalar XAMPP (Más fácil)
# https://www.apachefriends.org/
```

### **2. 🔧 Configurar Contraseña**
```bash
# Edita el archivo .env y cambia:
DB_PASSWORD=tu_contraseña_mysql_aqui

# Si usas XAMPP, deja vacío:
DB_PASSWORD=
```

### **3. 🗄️ Crear Base de Datos**
```sql
-- En MySQL Workbench o phpMyAdmin:
CREATE DATABASE pethouse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### **4. ✅ Verificar Conexión**
```bash
npm run db:check
```

### **5. 📊 Poblar con Datos**
```bash
npm run db:seed
```

### **6. 🚀 Iniciar Servidor**
```bash
npm run server
```

---

## **🎯 Comandos Útiles**

```bash
# Verificar si MySQL funciona
npm run db:check

# Crear tablas y datos de prueba
npm run db:seed

# Iniciar servidor con auto-recarga
npm run server:dev

# Ver si el puerto 3306 está ocupado
netstat -an | find "3306"
```

---

## **🚨 Problemas Comunes**

### **MySQL no se conecta:**
```bash
# 1. Verificar que MySQL esté corriendo
# 2. Revisar contraseña en .env
# 3. Ejecutar: npm run db:check
```

### **Base de datos no existe:**
```sql
CREATE DATABASE pethouse;
```

### **Tablas no existen:**
```bash
npm run db:seed
```

---

## **✅ Señales de Éxito**

Cuando todo funcione verás:
```
✅ MySQL conectado exitosamente
✅ Base de datos sincronizada
🚀 Servidor ejecutándose en puerto 5000
```

**¡Ya puedes usar PETHOUSE con MySQL real!** 🐕🐱