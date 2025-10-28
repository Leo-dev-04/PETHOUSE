// ========================================
//   RUTAS DE ADMINISTRACIÓN - MYSQL
// ========================================

const express = require('express');
const { Organizacion, Usuario, Mascota, SolicitudAdopcion } = require('../models-mysql');
const { Op } = require('sequelize');

const router = express.Router();

// Middleware de autenticación de admin (simplificado para desarrollo)
const requireAdmin = (req, res, next) => {
    // En producción, aquí validarías el token JWT y rol de admin
    // Por ahora, permitimos acceso directo para testing
    next();
};

// ========================================
//   OBTENER SOLICITUDES PENDIENTES
// ========================================

router.get('/solicitudes-organizaciones', requireAdmin, async (req, res) => {
    try {
        const { estado = 'pendiente', limit = 50, page = 1 } = req.query;

        if (global.useMockData) {
            return res.json({
                solicitudes: getMockSolicitudesPendientes(),
                stats: {
                    pendientes: 8,
                    aprobadas: 156,
                    rechazadas: 12,
                    total: 176
                }
            });
        }

        // Obtener solicitudes por estado
        const whereCondition = estado !== 'todas' ? { verificada: false, activa: false } : {};
        
        if (estado === 'aprobadas') whereCondition.verificada = true;
        if (estado === 'rechazadas') whereCondition.activa = false;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: solicitudes } = await Organizacion.findAndCountAll({
            where: whereCondition,
            order: [['fechaRegistro', 'DESC']],
            limit: parseInt(limit),
            offset,
            attributes: [
                'id', 'nombreOrganizacion', 'tipoOrganizacion', 'email',
                'telefono', 'ubicacion', 'fechaRegistro', 'verificada', 'activa',
                'descripcion', 'documentacionLegal'
            ]
        });

        // Obtener estadísticas
        const stats = await Organizacion.findAll({
            attributes: [
                [Organizacion.sequelize.literal('SUM(CASE WHEN verificada = false AND activa = true THEN 1 ELSE 0 END)'), 'pendientes'],
                [Organizacion.sequelize.literal('SUM(CASE WHEN verificada = true AND activa = true THEN 1 ELSE 0 END)'), 'aprobadas'],
                [Organizacion.sequelize.literal('SUM(CASE WHEN activa = false THEN 1 ELSE 0 END)'), 'rechazadas'],
                [Organizacion.sequelize.literal('COUNT(*)'), 'total']
            ]
        });

        res.json({
            solicitudes,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(count / parseInt(limit)),
                count: solicitudes.length,
                totalSolicitudes: count
            },
            stats: stats[0]?.dataValues || { pendientes: 0, aprobadas: 0, rechazadas: 0, total: 0 }
        });

    } catch (error) {
        console.error('Error obteniendo solicitudes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ========================================
//   OBTENER DETALLES DE SOLICITUD
// ========================================

router.get('/solicitudes-organizaciones/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (global.useMockData) {
            const mockData = getMockSolicitudesPendientes();
            const solicitud = mockData.find(s => s.id === parseInt(id));
            
            if (!solicitud) {
                return res.status(404).json({ error: 'Solicitud no encontrada' });
            }
            
            return res.json(solicitud);
        }

        const organizacion = await Organizacion.findByPk(id);

        if (!organizacion) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json(organizacion);

    } catch (error) {
        console.error('Error obteniendo detalles de solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ========================================
//   APROBAR SOLICITUD
// ========================================

router.post('/solicitudes-organizaciones/:id/aprobar', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { comentarios = '' } = req.body;

        if (global.useMockData) {
            return res.json({
                success: true,
                message: 'Organización aprobada exitosamente (modo simulación)',
                organizacion: {
                    id: parseInt(id),
                    nombreOrganizacion: 'Organización Mock',
                    verificada: true,
                    fechaVerificacion: new Date()
                }
            });
        }

        const organizacion = await Organizacion.findByPk(id);

        if (!organizacion) {
            return res.status(404).json({ error: 'Organización no encontrada' });
        }

        if (organizacion.verificada) {
            return res.status(400).json({ error: 'La organización ya está verificada' });
        }

        // Actualizar estado a verificada
        await organizacion.update({
            verificada: true,
            activa: true,
            fechaVerificacion: new Date(),
            comentariosVerificacion: comentarios
        });

        // Aquí podrías enviar email de bienvenida
        // await enviarEmailBienvenida(organizacion.email, organizacion.nombreOrganizacion);

        res.json({
            success: true,
            message: 'Organización aprobada exitosamente',
            organizacion: {
                id: organizacion.id,
                nombreOrganizacion: organizacion.nombreOrganizacion,
                email: organizacion.email,
                verificada: true,
                fechaVerificacion: organizacion.fechaVerificacion
            }
        });

    } catch (error) {
        console.error('Error aprobando solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ========================================
//   RECHAZAR SOLICITUD
// ========================================

router.post('/solicitudes-organizaciones/:id/rechazar', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo = '', comentarios = '' } = req.body;

        if (!motivo.trim()) {
            return res.status(400).json({ error: 'El motivo de rechazo es obligatorio' });
        }

        if (global.useMockData) {
            return res.json({
                success: true,
                message: 'Organización rechazada (modo simulación)',
                organizacion: {
                    id: parseInt(id),
                    nombreOrganizacion: 'Organización Mock',
                    verificada: false,
                    activa: false,
                    motivoRechazo: motivo
                }
            });
        }

        const organizacion = await Organizacion.findByPk(id);

        if (!organizacion) {
            return res.status(404).json({ error: 'Organización no encontrada' });
        }

        // Actualizar estado a rechazada
        await organizacion.update({
            verificada: false,
            activa: false,
            fechaRechazo: new Date(),
            motivoRechazo: motivo,
            comentariosRechazo: comentarios
        });

        // Aquí podrías enviar email de rechazo
        // await enviarEmailRechazo(organizacion.email, organizacion.nombreOrganizacion, motivo);

        res.json({
            success: true,
            message: 'Organización rechazada',
            organizacion: {
                id: organizacion.id,
                nombreOrganizacion: organizacion.nombreOrganizacion,
                email: organizacion.email,
                verificada: false,
                activa: false,
                motivoRechazo: motivo
            }
        });

    } catch (error) {
        console.error('Error rechazando solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ========================================
//   ESTADÍSTICAS DE ADMINISTRACIÓN
// ========================================

router.get('/dashboard/stats', requireAdmin, async (req, res) => {
    try {
        if (global.useMockData) {
            return res.json({
                organizaciones: {
                    pendientes: 8,
                    verificadas: 156,
                    rechazadas: 12,
                    total: 176
                },
                mascotas: {
                    disponibles: 1247,
                    enProceso: 89,
                    adoptadas: 2341,
                    total: 3677
                },
                adopciones: {
                    pendientes: 156,
                    aprobadas: 78,
                    completadas: 2341,
                    total: 2575
                },
                usuarios: {
                    activos: 12847,
                    verificados: 9234,
                    nuevosEsteMes: 456
                }
            });
        }

        // Estadísticas de organizaciones
        const statsOrganizaciones = await Organizacion.findAll({
            attributes: [
                [Organizacion.sequelize.literal('SUM(CASE WHEN verificada = false AND activa = true THEN 1 ELSE 0 END)'), 'pendientes'],
                [Organizacion.sequelize.literal('SUM(CASE WHEN verificada = true AND activa = true THEN 1 ELSE 0 END)'), 'verificadas'],
                [Organizacion.sequelize.literal('SUM(CASE WHEN activa = false THEN 1 ELSE 0 END)'), 'rechazadas'],
                [Organizacion.sequelize.literal('COUNT(*)'), 'total']
            ]
        });

        // Estadísticas de mascotas
        const statsMascotas = await Mascota.findAll({
            attributes: [
                'estado',
                [Mascota.sequelize.fn('COUNT', Mascota.sequelize.col('id')), 'count']
            ],
            group: ['estado']
        });

        // Estadísticas de adopciones
        const statsAdopciones = await SolicitudAdopcion.findAll({
            attributes: [
                'estado',
                [SolicitudAdopcion.sequelize.fn('COUNT', SolicitudAdopcion.sequelize.col('id')), 'count']
            ],
            group: ['estado']
        });

        // Estadísticas de usuarios
        const totalUsuarios = await Usuario.count();
        const usuariosVerificados = await Usuario.count({ where: { verificado: true } });

        res.json({
            organizaciones: statsOrganizaciones[0]?.dataValues || { pendientes: 0, verificadas: 0, rechazadas: 0, total: 0 },
            mascotas: statsMascotas.reduce((acc, stat) => {
                acc[stat.estado] = parseInt(stat.dataValues.count);
                acc.total = (acc.total || 0) + parseInt(stat.dataValues.count);
                return acc;
            }, {}),
            adopciones: statsAdopciones.reduce((acc, stat) => {
                acc[stat.estado] = parseInt(stat.dataValues.count);
                acc.total = (acc.total || 0) + parseInt(stat.dataValues.count);
                return acc;
            }, {}),
            usuarios: {
                total: totalUsuarios,
                verificados: usuariosVerificados,
                nuevosEsteMes: Math.floor(totalUsuarios * 0.1) // Estimación
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ========================================
//   DATOS MOCK PARA DESARROLLO
// ========================================

function getMockSolicitudesPendientes() {
    return [
        {
            id: 4,
            nombreOrganizacion: "Refugio Esperanza Canina",
            tipoOrganizacion: "refugio",
            email: "contacto@esperanzacanina.org",
            telefono: "+52 33 1234-5678",
            descripcion: "Refugio especializado en la rehabilitación de perros rescatados de la calle. Contamos con veterinarios especializados y programas de entrenamiento.",
            ubicacion: {
                direccion: "Av. Revolución #456, Guadalajara, Jalisco",
                ciudad: "Guadalajara",
                estado: "Jalisco",
                coordenadas: {
                    latitud: 20.6597,
                    longitud: -103.3496
                }
            },
            personaContacto: "María González",
            cargoContacto: "Directora",
            fechaRegistro: "2025-01-20",
            verificada: false,
            activa: true,
            documentacionLegal: {
                actaConstitutiva: "acta_esperanza_canina.pdf",
                identificacion: "ine_maria_gonzalez.pdf",
                registroOficial: "RFC: ECA250120XXX"
            }
        },
        {
            id: 5,
            nombreOrganizacion: "Fundación Amor Felino",
            tipoOrganizacion: "fundacion",
            email: "info@amorfelino.mx",
            telefono: "+52 55 9876-5432",
            descripcion: "Fundación dedicada exclusivamente al rescate, esterilización y adopción de gatos. Trabajamos con colonias felinas para controlar la sobrepoblación.",
            ubicacion: {
                direccion: "Calle Gatos #789, Roma Norte, CDMX",
                ciudad: "Ciudad de México",
                estado: "CDMX",
                coordenadas: {
                    latitud: 19.4186,
                    longitud: -99.1566
                }
            },
            personaContacto: "Carlos Ruiz",
            cargoContacto: "Coordinador General",
            fechaRegistro: "2025-01-22",
            verificada: false,
            activa: true,
            documentacionLegal: {
                actaConstitutiva: "acta_amor_felino.pdf",
                identificacion: "ine_carlos_ruiz.pdf",
                registroOficial: "CLUNI: AF-2025-001"
            }
        },
        {
            id: 6,
            nombreOrganizacion: "Asociación Patitas Monterrey",
            tipoOrganizacion: "asociacion",
            email: "patitas@monterrey.org",
            telefono: "+52 81 5555-1234",
            descripcion: "Asociación civil que se enfoca en el rescate de animales en situaciones de emergencia y su posterior rehabilitación para adopción.",
            ubicacion: {
                direccion: "Av. Constitución #321, Monterrey, N.L.",
                ciudad: "Monterrey",
                estado: "Nuevo León",
                coordenadas: {
                    latitud: 25.6866,
                    longitud: -100.3161
                }
            },
            personaContacto: "Ana Patricia Medina",
            cargoContacto: "Presidenta",
            fechaRegistro: "2025-01-25",
            verificada: false,
            activa: true,
            documentacionLegal: {
                actaConstitutiva: "acta_patitas_mty.pdf",
                identificacion: "ine_ana_medina.pdf",
                registroOficial: "RFC: APM250125XXX"
            }
        }
    ];
}

module.exports = router;