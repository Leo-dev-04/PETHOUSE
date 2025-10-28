// ========================================
//   MODELO SOLICITUD ADOPCIÓN - MYSQL/SEQUELIZE
// ========================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database-mysql');

const SolicitudAdopcion = sequelize.define('SolicitudAdopcion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    // Referencias (Foreign Keys)
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    mascotaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'mascotas',
            key: 'id'
        }
    },
    organizacionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'organizaciones',
            key: 'id'
        }
    },
    
    // Estado de la solicitud
    estado: {
        type: DataTypes.ENUM(
            'pendiente_revision',
            'en_revision',
            'entrevista_programada',
            'visita_domiciliaria',
            'aprobada',
            'rechazada',
            'cancelada',
            'completada'
        ),
        defaultValue: 'pendiente_revision'
    },
    
    // Información del formulario de adopción
    datosAdoptante: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Los datos del adoptante son requeridos' }
        }
    },
    
    // Fechas importantes
    fechaSolicitud: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fechaRevision: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fechaEntrevista: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fechaVisitaDomiciliaria: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fechaDecision: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fechaAdopcion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    
    // Notas y comentarios
    notasOrganizacion: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    notasAdoptante: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    // Entrevista
    entrevista: {
        type: DataTypes.JSON,
        defaultValue: {
            realizada: false,
            resultado: 'pendiente'
        }
    },
    
    // Visita domiciliaria
    visitaDomiciliaria: {
        type: DataTypes.JSON,
        defaultValue: {
            realizada: false,
            resultado: 'pendiente'
        }
    },
    
    // Documentos adjuntos
    documentos: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    
    // Razón de rechazo o cancelación
    razonRechazo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    razonCancelacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    // Seguimiento post-adopción
    seguimiento: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    
    // Calificación de la experiencia
    calificacion: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
}, {
    tableName: 'solicitudes_adopcion',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    
    // Índices
    indexes: [
        { fields: ['usuarioId', 'estado'] },
        { fields: ['mascotaId', 'estado'] },
        { fields: ['organizacionId', 'estado'] },
        { fields: ['fechaSolicitud'] },
        { fields: ['estado', 'fechaSolicitud'] }
    ]
});

// Métodos de instancia
SolicitudAdopcion.prototype.agregarNota = async function(autor, contenido, tipo = 'info') {
    const notas = [...this.notasOrganizacion];
    notas.push({
        autor,
        contenido,
        tipo,
        fecha: new Date()
    });
    this.notasOrganizacion = notas;
    return await this.save();
};

SolicitudAdopcion.prototype.cambiarEstado = async function(nuevoEstado, notas = '') {
    this.estado = nuevoEstado;
    
    switch (nuevoEstado) {
        case 'en_revision':
            this.fechaRevision = new Date();
            break;
        case 'aprobada':
        case 'rechazada':
            this.fechaDecision = new Date();
            break;
        case 'completada':
            this.fechaAdopcion = new Date();
            break;
    }
    
    if (notas) {
        await this.agregarNota('Sistema', notas, 'info');
    }
    
    return await this.save();
};

SolicitudAdopcion.prototype.getTiempoTranscurrido = function() {
    const ahora = new Date();
    const diferencia = ahora - this.fechaSolicitud;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24)); // días
};

// Métodos de clase
SolicitudAdopcion.findPendientes = function() {
    return this.findAll({
        where: {
            estado: ['pendiente_revision', 'en_revision', 'entrevista_programada', 'visita_domiciliaria']
        },
        include: ['Usuario', 'Mascota', 'Organizacion'],
        order: [['fechaSolicitud', 'ASC']]
    });
};

SolicitudAdopcion.findByUsuario = function(usuarioId, estado = null) {
    const where = { usuarioId };
    if (estado) where.estado = estado;
    
    return this.findAll({
        where,
        include: ['Mascota', 'Organizacion'],
        order: [['fechaSolicitud', 'DESC']]
    });
};

SolicitudAdopcion.findByOrganizacion = function(organizacionId, estado = null) {
    const where = { organizacionId };
    if (estado) where.estado = estado;
    
    return this.findAll({
        where,
        include: ['Usuario', 'Mascota'],
        order: [['fechaSolicitud', 'DESC']]
    });
};

module.exports = SolicitudAdopcion;