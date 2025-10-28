// ========================================
//   MODELO ORGANIZACIÓN - MYSQL/SEQUELIZE
// ========================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database-mysql');

const Organizacion = sequelize.define('Organizacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombreOrganizacion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre de la organización es requerido' },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres'
            }
        }
    },
    tipoOrganizacion: {
        type: DataTypes.ENUM('refugio', 'rescatista_independiente', 'fundacion', 'asociacion_civil', 'otro'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El tipo de organización es requerido' }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La descripción es requerida' },
            len: {
                args: [10, 1000],
                msg: 'La descripción debe tener entre 10 y 1000 caracteres'
            }
        }
    },
    añoFundacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: 1900,
                msg: 'Año de fundación inválido'
            },
            max: {
                args: new Date().getFullYear(),
                msg: 'El año no puede ser futuro'
            }
        }
    },
    numeroMascotas: {
        type: DataTypes.ENUM('1-10', '11-50', '51-100', '100+'),
        allowNull: true
    },
    
    // Información de contacto
    personaContacto: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La persona de contacto es requerida' }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            name: 'unique_org_email',
            msg: 'Este email ya está registrado'
        },
        validate: {
            isEmail: { msg: 'Email inválido' },
            notEmpty: { msg: 'El email es requerido' }
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El teléfono es requerido' }
        }
    },
    sitioWeb: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isUrl: { msg: 'URL del sitio web inválida' }
        }
    },
    redesSociales: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Ubicación
    ubicacion: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La ubicación es requerida' }
        }
    },
    
    // Documentación legal
    documentacionLegal: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Servicios ofrecidos
    servicios: {
        type: DataTypes.JSON,
        defaultValue: {
            adopciones: true,
            esterilizacion: false,
            atencionVeterinaria: false,
            rescateEmergencia: false,
            educacion: false,
            albergueTemporol: false
        }
    },
    
    // Horarios de atención
    horarios: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Estado y validación
    verificada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    fechaVerificacion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    
    // Estadísticas
    estadisticas: {
        type: DataTypes.JSON,
        defaultValue: {
            mascotasRescatadas: 0,
            adopcionesRealizadas: 0,
            mascotasActuales: 0
        }
    }
}, {
    tableName: 'organizaciones',
    timestamps: true,
    createdAt: 'fechaRegistro',
    updatedAt: 'fechaActualizacion',
    
    // Índices
    indexes: [
        { fields: ['nombreOrganizacion'] },
        { fields: ['email'] },
        { fields: ['tipoOrganizacion'] },
        { fields: ['verificada', 'activa'] },
        { fields: ['fechaRegistro'] }
    ]
});

// Métodos de instancia
Organizacion.prototype.getInfoBasica = function() {
    return {
        id: this.id,
        nombre: this.nombreOrganizacion,
        tipo: this.tipoOrganizacion,
        descripcion: this.descripcion,
        email: this.email,
        telefono: this.telefono,
        ubicacion: this.ubicacion,
        verificada: this.verificada,
        servicios: this.servicios,
        contactoCompleto: `${this.personaContacto} - ${this.nombreOrganizacion}`
    };
};

// Métodos de clase
Organizacion.findVerificadas = function() {
    return this.findAll({ 
        where: { 
            verificada: true, 
            activa: true 
        } 
    });
};

Organizacion.findByTipo = function(tipo) {
    return this.findAll({ 
        where: { 
            tipoOrganizacion: tipo,
            activa: true 
        } 
    });
};

Organizacion.findConMascotas = async function() {
    const { Mascota } = require('./index');
    return this.findAll({
        where: { activa: true },
        include: [{
            model: Mascota,
            where: { estado: 'disponible' },
            required: true
        }]
    });
};

module.exports = Organizacion;