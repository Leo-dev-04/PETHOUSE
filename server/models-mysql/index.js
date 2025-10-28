// ========================================
//   ÍNDICE DE MODELOS Y RELACIONES - MYSQL
// ========================================

const { sequelize } = require('../database-mysql');

// Importar todos los modelos
const Usuario = require('./Usuario');
const Organizacion = require('./Organizacion');
const Mascota = require('./Mascota');
const SolicitudAdopcion = require('./SolicitudAdopcion');

// ========================================
//   DEFINIR RELACIONES
// ========================================

// Relación Usuario - SolicitudAdopcion
Usuario.hasMany(SolicitudAdopcion, {
    foreignKey: 'usuarioId',
    as: 'solicitudesAdopcion'
});
SolicitudAdopcion.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'Usuario'
});

// Relación Organizacion - Mascota
Organizacion.hasMany(Mascota, {
    foreignKey: 'organizacionId',
    as: 'mascotas'
});
Mascota.belongsTo(Organizacion, {
    foreignKey: 'organizacionId',
    as: 'Organizacion'
});

// Relación Organizacion - SolicitudAdopcion
Organizacion.hasMany(SolicitudAdopcion, {
    foreignKey: 'organizacionId',
    as: 'solicitudesRecibidas'
});
SolicitudAdopcion.belongsTo(Organizacion, {
    foreignKey: 'organizacionId',
    as: 'Organizacion'
});

// Relación Mascota - SolicitudAdopcion
Mascota.hasMany(SolicitudAdopcion, {
    foreignKey: 'mascotaId',
    as: 'solicitudesAdopcion'
});
SolicitudAdopcion.belongsTo(Mascota, {
    foreignKey: 'mascotaId',
    as: 'Mascota'
});

// Relación Usuario - Mascota (adoptante)
Usuario.hasMany(Mascota, {
    foreignKey: 'adoptanteId',
    as: 'mascotasAdoptadas'
});
Mascota.belongsTo(Usuario, {
    foreignKey: 'adoptanteId',
    as: 'Adoptante'
});

// ========================================
//   EXPORTAR MODELOS Y SEQUELIZE
// ========================================

module.exports = {
    sequelize,
    Usuario,
    Organizacion,
    Mascota,
    SolicitudAdopcion
};