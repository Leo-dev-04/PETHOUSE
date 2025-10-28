// ========================================
//   MODELO USUARIO - MYSQL/SEQUELIZE
// ========================================

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../database-mysql');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre es requerido' },
            len: {
                args: [2, 50],
                msg: 'El nombre debe tener entre 2 y 50 caracteres'
            }
        }
    },
    apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El apellido es requerido' },
            len: {
                args: [2, 50],
                msg: 'El apellido debe tener entre 2 y 50 caracteres'
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            name: 'unique_email',
            msg: 'Este email ya está registrado'
        },
        validate: {
            isEmail: { msg: 'Por favor ingresa un email válido' },
            notEmpty: { msg: 'El email es requerido' }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La contraseña es requerida' },
            len: {
                args: [6, 255],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El teléfono es requerido' }
        }
    },
    direccion: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    tipoVivienda: {
        type: DataTypes.ENUM('casa', 'apartamento', 'finca', 'otro'),
        allowNull: true
    },
    tienePatio: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    experienciaMascotas: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    preferenciasMascotas: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    ultimoAcceso: {
        type: DataTypes.DATE,
        allowNull: true
    },
    verificado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'fechaRegistro',
    updatedAt: 'fechaActualizacion',
    
    // Índices
    indexes: [
        { fields: ['email'] },
        { fields: ['telefono'] },
        { fields: ['fechaRegistro'] },
        { fields: ['activo'] }
    ],
    
    // Hooks para hashear password
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(12);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                const salt = await bcrypt.genSalt(12);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

// Métodos de instancia
Usuario.prototype.compararPassword = async function(passwordIngresado) {
    return await bcrypt.compare(passwordIngresado, this.password);
};

Usuario.prototype.getPerfilPublico = function() {
    return {
        id: this.id,
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        telefono: this.telefono,
        fechaRegistro: this.fechaRegistro,
        verificado: this.verificado,
        nombreCompleto: `${this.nombre} ${this.apellido}`
    };
};

// Métodos de clase
Usuario.findByEmail = function(email) {
    return this.findOne({ where: { email: email.toLowerCase() } });
};

Usuario.findActivos = function() {
    return this.findAll({ where: { activo: true } });
};

module.exports = Usuario;