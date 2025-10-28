// ========================================
//   RUTAS DE ADOPCIONES - MYSQL
// ========================================

const express = require('express');
const { SolicitudAdopcion, Usuario, Mascota, Organizacion } = require('../models-mysql');
const { Op } = require('sequelize');

const router = express.Router();

// ========================================
//   OBTENER TODAS LAS SOLICITUDES
// ========================================

router.get('/', async (req, res) => {
    try {
        // Si no hay MySQL, usar datos mock
        if (global.useMockData) {
            return res.json({
                solicitudes: getMockSolicitudes(),
                pagination: {
                    current: 1,
                    total: 1,
                    count: getMockSolicitudes().length,
                    totalSolicitudes: getMockSolicitudes().length
                }
            });
        }

        const {
            estado,
            organizacionId,
            usuarioId,
            limit = 20,
            page = 1
        } = req.query;

        // Construir filtros
        const filtros = {};

        if (estado) filtros.estado = estado;
        if (organizacionId) filtros.organizacionId = organizacionId;
        if (usuarioId) filtros.usuarioId = usuarioId;

        // Paginación
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: solicitudes } = await SolicitudAdopcion.findAndCountAll({
            where: filtros,
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombreCompleto', 'email', 'telefono']
                },
                {
                    model: Mascota,
                    as: 'mascota',
                    attributes: ['id', 'nombre', 'tipo', 'raza', 'edad', 'imagenPrincipal']
                },
                {
                    model: Organizacion,
                    as: 'organizacion',
                    attributes: ['id', 'nombreOrganizacion', 'email', 'telefono']
                }
            ],
            order: [['fechaSolicitud', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        res.json({
            solicitudes,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(count / parseInt(limit)),
                count: solicitudes.length,
                totalSolicitudes: count
            }
        });

    } catch (error) {
        console.error('Error obteniendo solicitudes:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   CREAR NUEVA SOLICITUD
// ========================================

router.post('/', async (req, res) => {
    try {
        const {
            usuarioId,
            mascotaId,
            organizacionId,
            tipoVivienda,
            experienciaMascotas,
            motivoAdopcion,
            disponibilidadTiempo,
            contactoEmergencia,
            comentariosAdicionales
        } = req.body;

        // Validar campos obligatorios
        if (!usuarioId || !mascotaId || !organizacionId) {
            return res.status(400).json({
                error: 'Usuario, mascota y organización son obligatorios'
            });
        }

        // Si no hay MySQL, simular creación
        if (global.useMockData) {
            const nuevaSolicitud = {
                id: Date.now(),
                usuarioId,
                mascotaId,
                organizacionId,
                estado: 'pendiente',
                tipoVivienda,
                experienciaMascotas,
                motivoAdopcion,
                disponibilidadTiempo,
                contactoEmergencia,
                comentariosAdicionales,
                fechaSolicitud: new Date(),
                usuario: { id: usuarioId, nombreCompleto: "Usuario Mock" },
                mascota: { id: mascotaId, nombre: "Mascota Mock" },
                organizacion: { id: organizacionId, nombreOrganizacion: "Organización Mock" }
            };

            return res.status(201).json({
                message: 'Solicitud de adopción enviada exitosamente',
                solicitud: nuevaSolicitud
            });
        }

        // Verificar que la mascota existe y está disponible
        const mascota = await Mascota.findByPk(mascotaId);
        if (!mascota) {
            return res.status(404).json({
                error: 'Mascota no encontrada'
            });
        }

        if (mascota.estado !== 'disponible') {
            return res.status(400).json({
                error: 'La mascota no está disponible para adopción'
            });
        }

        // Verificar que no existe una solicitud activa del mismo usuario para esta mascota
        const solicitudExistente = await SolicitudAdopcion.findOne({
            where: {
                usuarioId,
                mascotaId,
                estado: ['pendiente', 'en_revision', 'aprobada']
            }
        });

        if (solicitudExistente) {
            return res.status(400).json({
                error: 'Ya tienes una solicitud activa para esta mascota'
            });
        }

        // Crear la solicitud
        const nuevaSolicitud = await SolicitudAdopcion.create({
            usuarioId,
            mascotaId,
            organizacionId,
            estado: 'pendiente',
            tipoVivienda,
            experienciaMascotas,
            motivoAdopcion,
            disponibilidadTiempo,
            contactoEmergencia,
            comentariosAdicionales,
            fechaSolicitud: new Date()
        });

        // Incluir datos relacionados en la respuesta
        const solicitudCompleta = await SolicitudAdopcion.findByPk(nuevaSolicitud.id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombreCompleto', 'email', 'telefono']
                },
                {
                    model: Mascota,
                    as: 'mascota',
                    attributes: ['id', 'nombre', 'tipo', 'raza', 'edad', 'imagenPrincipal']
                },
                {
                    model: Organizacion,
                    as: 'organizacion',
                    attributes: ['id', 'nombreOrganizacion', 'email', 'telefono']
                }
            ]
        });

        res.status(201).json({
            message: 'Solicitud de adopción enviada exitosamente',
            solicitud: solicitudCompleta
        });

    } catch (error) {
        console.error('Error creando solicitud:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   OBTENER SOLICITUD POR ID
// ========================================

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (global.useMockData) {
            const mockData = getMockSolicitudes();
            const solicitud = mockData.find(s => s.id === parseInt(id));
            
            if (!solicitud) {
                return res.status(404).json({ error: 'Solicitud no encontrada' });
            }
            
            return res.json(solicitud);
        }

        const solicitud = await SolicitudAdopcion.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombreCompleto', 'email', 'telefono', 'ubicacion', 'experienciaConMascotas']
                },
                {
                    model: Mascota,
                    as: 'mascota',
                    attributes: ['id', 'nombre', 'tipo', 'raza', 'edad', 'imagenes', 'imagenPrincipal', 'personalidad', 'necesidadesEspeciales']
                },
                {
                    model: Organizacion,
                    as: 'organizacion',
                    attributes: ['id', 'nombreOrganizacion', 'email', 'telefono', 'ubicacion']
                }
            ]
        });

        if (!solicitud) {
            return res.status(404).json({
                error: 'Solicitud no encontrada'
            });
        }

        res.json(solicitud);

    } catch (error) {
        console.error('Error obteniendo solicitud:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   ACTUALIZAR ESTADO DE SOLICITUD
// ========================================

router.patch('/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, comentarios } = req.body;

        const estadosPermitidos = ['pendiente', 'en_revision', 'aprobada', 'rechazada', 'completada'];
        
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                error: 'Estado inválido'
            });
        }

        if (global.useMockData) {
            return res.json({
                message: 'Estado actualizado exitosamente (modo simulación)',
                solicitud: { id: parseInt(id), estado, comentarios }
            });
        }

        const solicitud = await SolicitudAdopcion.findByPk(id);
        
        if (!solicitud) {
            return res.status(404).json({
                error: 'Solicitud no encontrada'
            });
        }

        // Actualizar estado
        await solicitud.update({
            estado,
            comentarios,
            fechaActualizacion: new Date()
        });

        // Si la solicitud es aprobada, cambiar estado de la mascota
        if (estado === 'aprobada') {
            const mascota = await Mascota.findByPk(solicitud.mascotaId);
            if (mascota) {
                await mascota.update({ estado: 'en_proceso_adopcion' });
            }
        }

        // Si la adopción se completa, cambiar estado de la mascota
        if (estado === 'completada') {
            const mascota = await Mascota.findByPk(solicitud.mascotaId);
            if (mascota) {
                await mascota.update({ 
                    estado: 'adoptado',
                    fechaAdopcion: new Date()
                });
            }
        }

        // Si se rechaza, liberar la mascota
        if (estado === 'rechazada') {
            const mascota = await Mascota.findByPk(solicitud.mascotaId);
            if (mascota && mascota.estado === 'en_proceso_adopcion') {
                await mascota.update({ estado: 'disponible' });
            }
        }

        res.json({
            message: 'Estado actualizado exitosamente',
            solicitud: await SolicitudAdopcion.findByPk(id, {
                include: [
                    { model: Usuario, as: 'usuario', attributes: ['nombreCompleto'] },
                    { model: Mascota, as: 'mascota', attributes: ['nombre'] },
                    { model: Organizacion, as: 'organizacion', attributes: ['nombreOrganizacion'] }
                ]
            })
        });

    } catch (error) {
        console.error('Error actualizando estado:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   SOLICITUDES DE UN USUARIO
// ========================================

router.get('/usuario/:usuarioId', async (req, res) => {
    try {
        const { usuarioId } = req.params;

        if (global.useMockData) {
            const mockData = getMockSolicitudes();
            const solicitudesUsuario = mockData.filter(s => s.usuarioId === parseInt(usuarioId));
            return res.json(solicitudesUsuario);
        }

        const solicitudes = await SolicitudAdopcion.findAll({
            where: { usuarioId },
            include: [
                {
                    model: Mascota,
                    as: 'mascota',
                    attributes: ['id', 'nombre', 'tipo', 'raza', 'edad', 'imagenPrincipal']
                },
                {
                    model: Organizacion,
                    as: 'organizacion',
                    attributes: ['id', 'nombreOrganizacion', 'telefono']
                }
            ],
            order: [['fechaSolicitud', 'DESC']]
        });

        res.json(solicitudes);

    } catch (error) {
        console.error('Error obteniendo solicitudes del usuario:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   SOLICITUDES DE UNA ORGANIZACIÓN
// ========================================

router.get('/organizacion/:organizacionId', async (req, res) => {
    try {
        const { organizacionId } = req.params;
        const { estado } = req.query;

        if (global.useMockData) {
            const mockData = getMockSolicitudes();
            let solicitudesOrg = mockData.filter(s => s.organizacionId === parseInt(organizacionId));
            
            if (estado) {
                solicitudesOrg = solicitudesOrg.filter(s => s.estado === estado);
            }
            
            return res.json(solicitudesOrg);
        }

        const filtros = { organizacionId };
        if (estado) filtros.estado = estado;

        const solicitudes = await SolicitudAdopcion.findAll({
            where: filtros,
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombreCompleto', 'email', 'telefono']
                },
                {
                    model: Mascota,
                    as: 'mascota',
                    attributes: ['id', 'nombre', 'tipo', 'raza', 'edad', 'imagenPrincipal']
                }
            ],
            order: [['fechaSolicitud', 'DESC']]
        });

        res.json(solicitudes);

    } catch (error) {
        console.error('Error obteniendo solicitudes de la organización:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   ESTADÍSTICAS DE ADOPCIONES
// ========================================

router.get('/stats/general', async (req, res) => {
    try {
        if (global.useMockData) {
            return res.json({
                solicitudesPendientes: 12,
                solicitudesAprobadas: 8,
                adopcionesCompletadas: 15,
                solicitudesTotales: 35,
                porcentajeExito: 42.8
            });
        }

        // Contar solicitudes por estado
        const estadisticas = await SolicitudAdopcion.findAll({
            attributes: [
                'estado',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            group: ['estado']
        });

        const stats = estadisticas.reduce((acc, stat) => {
            acc[stat.estado] = parseInt(stat.dataValues.count);
            return acc;
        }, {});

        const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
        const completadas = stats.completada || 0;
        const porcentajeExito = total > 0 ? ((completadas / total) * 100).toFixed(1) : 0;

        res.json({
            solicitudesPendientes: stats.pendiente || 0,
            solicitudesAprobadas: stats.aprobada || 0,
            adopcionesCompletadas: completadas,
            solicitudesTotales: total,
            porcentajeExito: parseFloat(porcentajeExito),
            detalleEstados: stats
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   DATOS MOCK PARA DESARROLLO
// ========================================

function getMockSolicitudes() {
    return [
        {
            id: 1,
            usuarioId: 1,
            mascotaId: 1,
            organizacionId: 1,
            estado: 'pendiente',
            tipoVivienda: 'casa',
            experienciaMascotas: 'Tuve un perro durante 10 años',
            motivoAdopcion: 'Busco un compañero fiel para mi familia',
            disponibilidadTiempo: 'Tengo tiempo completo para dedicarle',
            contactoEmergencia: {
                nombre: 'María González',
                telefono: '+52 555 987 6543',
                relacion: 'Hermana'
            },
            fechaSolicitud: '2024-01-15',
            usuario: { id: 1, nombreCompleto: 'Juan Pérez', email: 'juan@email.com' },
            mascota: { id: 1, nombre: 'Luna', tipo: 'perro', raza: 'Golden Retriever' },
            organizacion: { id: 1, nombreOrganizacion: 'Fundación Patitas Felices' }
        },
        {
            id: 2,
            usuarioId: 2,
            mascotaId: 2,
            organizacionId: 2,
            estado: 'aprobada',
            tipoVivienda: 'departamento',
            experienciaMascotas: 'Primera vez adoptando',
            motivoAdopcion: 'Quiero ayudar a un animal rescatado',
            disponibilidadTiempo: 'Trabajo medio tiempo, tengo disponibilidad',
            contactoEmergencia: {
                nombre: 'Carlos López',
                telefono: '+52 555 123 4567',
                relacion: 'Padre'
            },
            fechaSolicitud: '2024-01-10',
            usuario: { id: 2, nombreCompleto: 'Ana Rodríguez', email: 'ana@email.com' },
            mascota: { id: 2, nombre: 'Max', tipo: 'perro', raza: 'Pastor Alemán' },
            organizacion: { id: 2, nombreOrganizacion: 'Refugio Esperanza' }
        }
    ];
}

module.exports = router;