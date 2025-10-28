// ========================================
//   MODELO MASCOTA - MYSQL/SEQUELIZE
// ========================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database-mysql');

const Mascota = sequelize.define('Mascota', {
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
                args: [1, 50],
                msg: 'El nombre debe tener entre 1 y 50 caracteres'
            }
        }
    },
    tipo: {
        type: DataTypes.ENUM('perro', 'gato', 'conejo', 'hamster', 'ave', 'reptil', 'otro'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El tipo de animal es requerido' }
        }
    },
    raza: {
        type: DataTypes.STRING(100),
        defaultValue: 'Mestizo'
    },
    edad: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La edad es requerida' }
        }
    },
    genero: {
        type: DataTypes.ENUM('macho', 'hembra'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El género es requerido' }
        }
    },
    tamaño: {
        type: DataTypes.ENUM('muy_pequeño', 'pequeño', 'mediano', 'grande', 'muy_grande'),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El tamaño es requerido' }
        }
    },
    peso: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    color: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    
    // Información médica
    salud: {
        type: DataTypes.JSON,
        defaultValue: {
            vacunado: false,
            esterilizado: false,
            microchip: false,
            desparasitado: false
        }
    },
    
    // Personalidad y comportamiento
    personalidad: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    nivelEnergia: {
        type: DataTypes.ENUM('bajo', 'medio', 'alto', 'muy_alto'),
        defaultValue: 'medio'
    },
    compatibilidad: {
        type: DataTypes.JSON,
        defaultValue: {
            niños: true,
            otrasmascotas: true,
            perros: true,
            gatos: true,
            apartamento: true
        }
    },
    
    // Historia y descripción
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La descripción es requerida' },
            len: {
                args: [10, 2000],
                msg: 'La descripción debe tener entre 10 y 2000 caracteres'
            }
        }
    },
    historia: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    necesidadesEspeciales: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cuidadosEspeciales: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    // Multimedia
    imagenes: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    imagenPrincipal: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    videos: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    
    // Adopción
    estado: {
        type: DataTypes.ENUM('disponible', 'en_proceso', 'adoptado', 'retirado', 'fallecido'),
        defaultValue: 'disponible'
    },
    fechaIngreso: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fechaAdopcion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    urgente: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    destacado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    
    // Relaciones (Foreign Keys se definen en associations)
    organizacionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'organizaciones',
            key: 'id'
        }
    },
    adoptanteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    
    // Ubicación
    ubicacion: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    
    // Estadísticas
    estadisticas: {
        type: DataTypes.JSON,
        defaultValue: {
            vistas: 0,
            favoritos: 0,
            consultas: 0,
            solicitudesAdopcion: 0
        }
    }
}, {
    tableName: 'mascotas',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    
    // Índices
    indexes: [
        { fields: ['tipo', 'estado'] },
        { fields: ['organizacionId', 'estado'] },
        { fields: ['genero'] },
        { fields: ['tamaño'] },
        { fields: ['urgente', 'destacado'] },
        { fields: ['fechaIngreso'] },
        { fields: ['adoptanteId'] }
    ]
});

// Métodos de instancia
Mascota.prototype.incrementarVistas = async function() {
    const estadisticas = { ...this.estadisticas };
    estadisticas.vistas = (estadisticas.vistas || 0) + 1;
    this.estadisticas = estadisticas;
    return await this.save();
};

Mascota.prototype.getEdadTexto = function() {
    const edad = this.edad;
    if (edad.años && edad.meses) {
        return `${edad.años} años y ${edad.meses} meses`;
    } else if (edad.años) {
        return `${edad.años} año${edad.años > 1 ? 's' : ''}`;
    } else if (edad.meses) {
        return `${edad.meses} mes${edad.meses > 1 ? 'es' : ''}`;
    }
    return 'Edad no especificada';
};

Mascota.prototype.getUrlImagenPrincipal = function() {
    return this.imagenPrincipal || 
           (this.imagenes && this.imagenes[0]) || 
           '/assets/images/mascota-default.jpg';
};

// Métodos de clase
Mascota.findDisponibles = function(filtros = {}) {
    return this.findAll({
        where: {
            estado: 'disponible',
            ...filtros
        },
        include: ['Organizacion'],
        order: [['urgente', 'DESC'], ['destacado', 'DESC'], ['fechaIngreso', 'DESC']]
    });
};

Mascota.findPorTipo = function(tipo) {
    return this.findAll({
        where: {
            tipo,
            estado: 'disponible'
        }
    });
};

Mascota.buscar = function(termino) {
    const { Op } = require('sequelize');
    return this.findAll({
        where: {
            estado: 'disponible',
            [Op.or]: [
                { nombre: { [Op.like]: `%${termino}%` } },
                { raza: { [Op.like]: `%${termino}%` } },
                { descripcion: { [Op.like]: `%${termino}%` } }
            ]
        },
        include: ['Organizacion'],
        limit: 20
    });
};

module.exports = Mascota;