// ========================================
//   RUTAS DE ORGANIZACIONES - MYSQL
// ========================================

const express = require('express');
const { Organizacion, Mascota } = require('../models-mysql');
const { Op } = require('sequelize');

const router = express.Router();

// ========================================
//   OBTENER TODAS LAS ORGANIZACIONES
// ========================================

router.get('/', async (req, res) => {
    try {
        // Si no hay MySQL, usar datos mock
        if (global.useMockData) {
            return res.json({
                organizaciones: getMockOrganizaciones(),
                pagination: {
                    current: 1,
                    total: 1,
                    count: getMockOrganizaciones().length,
                    totalOrganizaciones: getMockOrganizaciones().length
                }
            });
        }

        const {
            tipo,
            ciudad,
            estado,
            verificada,
            conMascotas,
            limit = 20,
            page = 1
        } = req.query;

        // Construir filtros
        const filtros = { activa: true };

        if (tipo) filtros.tipoOrganizacion = tipo;
        if (verificada !== undefined) filtros.verificada = verificada === 'true';

        // Filtros JSON para ubicación
        if (ciudad) {
            filtros['$ubicacion.ciudad$'] = { [Op.like]: `%${ciudad}%` };
        }
        if (estado) {
            filtros['$ubicacion.estado$'] = { [Op.like]: `%${estado}%` };
        }

        // Paginación
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let organizaciones = await Organizacion.findAndCountAll({
            where: filtros,
            attributes: { exclude: ['documentacionLegal'] }, // Excluir datos sensibles
            order: [['verificada', 'DESC'], ['fechaRegistro', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        // Si se solicita solo organizaciones con mascotas disponibles
        if (conMascotas === 'true') {
            const organizacionesConMascotas = [];
            
            for (let org of organizaciones.rows) {
                const mascotasDisponibles = await Mascota.count({
                    where: {
                        organizacionId: org.id,
                        estado: 'disponible'
                    }
                });
                
                if (mascotasDisponibles > 0) {
                    organizacionesConMascotas.push({
                        ...org.toJSON(),
                        mascotasDisponibles
                    });
                }
            }
            
            return res.json({
                organizaciones: organizacionesConMascotas,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(organizacionesConMascotas.length / parseInt(limit)),
                    count: organizacionesConMascotas.length,
                    totalOrganizaciones: organizacionesConMascotas.length
                }
            });
        }

        res.json({
            organizaciones: organizaciones.rows,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(organizaciones.count / parseInt(limit)),
                count: organizaciones.rows.length,
                totalOrganizaciones: organizaciones.count
            }
        });

    } catch (error) {
        console.error('Error obteniendo organizaciones:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   OBTENER ORGANIZACIÓN POR ID
// ========================================

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Si no hay MySQL, usar datos mock
        if (global.useMockData) {
            const mockData = getMockOrganizaciones();
            const organizacion = mockData.find(o => o.id === parseInt(id));
            
            if (!organizacion) {
                return res.status(404).json({ error: 'Organización no encontrada' });
            }
            
            return res.json({
                ...organizacion,
                mascotas: getMockMascotasForOrganization(parseInt(id)),
                estadisticas: {
                    disponibles: 3,
                    adoptados: 15,
                    en_proceso: 2
                }
            });
        }

        const organizacion = await Organizacion.findByPk(id, {
            attributes: { exclude: ['documentacionLegal'] } // Excluir datos sensibles
        });

        if (!organizacion) {
            return res.status(404).json({
                error: 'Organización no encontrada'
            });
        }

        // Obtener mascotas de la organización
        const mascotas = await Mascota.findAll({
            where: {
                organizacionId: id,
                estado: 'disponible'
            },
            attributes: ['id', 'nombre', 'tipo', 'raza', 'edad', 'imagenes', 'imagenPrincipal']
        });

        // Obtener estadísticas
        const estadisticas = await Mascota.findAll({
            where: { organizacionId: id },
            attributes: [
                'estado',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            group: ['estado']
        });

        const statsFormateadas = estadisticas.reduce((acc, stat) => {
            acc[stat.estado] = parseInt(stat.dataValues.count);
            return acc;
        }, {});

        res.json({
            ...organizacion.toJSON(),
            mascotas,
            estadisticas: {
                ...organizacion.estadisticas,
                ...statsFormateadas
            }
        });

    } catch (error) {
        console.error('Error obteniendo organización:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'ID de organización inválido'
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   MASCOTAS DE UNA ORGANIZACIÓN
// ========================================

router.get('/:id/mascotas', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado = 'disponible', limit = 20, page = 1 } = req.query;

        if (global.useMockData) {
            return res.json({
                mascotas: getMockMascotasForOrganization(parseInt(id)),
                pagination: { current: 1, total: 1, count: 2, totalMascotas: 2 }
            });
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const whereCondition = {
            organizacionId: id
        };

        if (estado !== 'todos') {
            whereCondition.estado = estado;
        }

        const { count, rows: mascotas } = await Mascota.findAndCountAll({
            where: whereCondition,
            order: [['fechaIngreso', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        res.json({
            mascotas,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(count / parseInt(limit)),
                count: mascotas.length,
                totalMascotas: count
            }
        });

    } catch (error) {
        console.error('Error obteniendo mascotas de organización:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   ORGANIZACIONES PARA EL MAPA
// ========================================

router.get('/mapa/ubicaciones', async (req, res) => {
    try {
        if (global.useMockData) {
            return res.json(getMockMapaOrganizaciones());
        }

        const organizaciones = await Organizacion.findAll({
            where: {
                activa: true,
                '$ubicacion.coordenadas.latitud$': { [Op.ne]: null },
                '$ubicacion.coordenadas.longitud$': { [Op.ne]: null }
            },
            attributes: ['id', 'nombreOrganizacion', 'tipoOrganizacion', 'ubicacion', 'email', 'telefono', 'servicios', 'verificada']
        });

        // Agregar información de mascotas disponibles
        const organizacionesConMascotas = [];
        
        for (let org of organizaciones) {
            const mascotasDisponibles = await Mascota.count({
                where: {
                    organizacionId: org.id,
                    estado: 'disponible'
                }
            });

            const tiposMascotas = await Mascota.findAll({
                where: {
                    organizacionId: org.id,
                    estado: 'disponible'
                },
                attributes: ['tipo'],
                group: ['tipo']
            });

            organizacionesConMascotas.push({
                ...org.toJSON(),
                mascotasDisponibles,
                tiposMascotas: tiposMascotas.map(t => t.tipo)
            });
        }

        res.json(organizacionesConMascotas);

    } catch (error) {
        console.error('Error obteniendo organizaciones para mapa:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   BUSCAR ORGANIZACIONES
// ========================================

router.get('/buscar/:termino', async (req, res) => {
    try {
        const { termino } = req.params;
        
        if (global.useMockData) {
            const mockData = getMockOrganizaciones();
            const resultados = mockData.filter(o => 
                o.nombreOrganizacion.toLowerCase().includes(termino.toLowerCase()) ||
                o.descripcion.toLowerCase().includes(termino.toLowerCase())
            );
            return res.json(resultados);
        }

        const organizaciones = await Organizacion.findAll({
            where: {
                activa: true,
                [Op.or]: [
                    { nombreOrganizacion: { [Op.like]: `%${termino}%` } },
                    { descripcion: { [Op.like]: `%${termino}%` } },
                    { '$ubicacion.ciudad$': { [Op.like]: `%${termino}%` } },
                    { '$ubicacion.estado$': { [Op.like]: `%${termino}%` } }
                ]
            },
            attributes: { exclude: ['documentacionLegal'] },
            limit: 20
        });

        res.json(organizaciones);

    } catch (error) {
        console.error('Error en búsqueda de organizaciones:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   DATOS MOCK PARA DESARROLLO
// ========================================

function getMockOrganizaciones() {
    return [
        {
            id: 1,
            nombreOrganizacion: "Fundación Patitas Felices",
            tipoOrganizacion: "fundacion",
            descripcion: "Dedicados al rescate y adopción de perros y gatos en situación de calle",
            email: "contacto@patitasfelices.org",
            telefono: "+52 555 123 4567",
            ubicacion: {
                direccion: "Av. Insurgentes #123",
                ciudad: "Ciudad de México",
                estado: "CDMX",
                coordenadas: {
                    latitud: 19.4326,
                    longitud: -99.1332
                }
            },
            servicios: {
                adopciones: true,
                esterilizacion: true,
                atencionVeterinaria: true
            },
            verificada: true,
            fechaRegistro: "2023-01-15"
        },
        {
            id: 2,
            nombreOrganizacion: "Refugio Esperanza",
            tipoOrganizacion: "refugio",
            descripcion: "Refugio para perros rescatados con espacios amplios para su rehabilitación",
            email: "info@refugioesperanza.com",
            telefono: "+52 555 987 6543",
            ubicacion: {
                direccion: "Carretera Nacional Km 25",
                ciudad: "Guadalajara",
                estado: "Jalisco",
                coordenadas: {
                    latitud: 20.6597,
                    longitud: -103.3496
                }
            },
            servicios: {
                adopciones: true,
                rescateEmergencia: true,
                albergueTemporol: true
            },
            verificada: true,
            fechaRegistro: "2023-03-20"
        }
    ];
}

function getMockMascotasForOrganization(orgId) {
    const todasLasMascotas = [
        { id: 1, organizacionId: 1, nombre: "Luna", tipo: "perro", raza: "Golden Retriever" },
        { id: 2, organizacionId: 2, nombre: "Max", tipo: "perro", raza: "Pastor Alemán" },
        { id: 3, organizacionId: 1, nombre: "Mía", tipo: "gato", raza: "Siamés" }
    ];
    
    return todasLasMascotas.filter(m => m.organizacionId === orgId);
}

function getMockMapaOrganizaciones() {
    return [
        {
            id: 1,
            nombreOrganizacion: "Fundación Patitas Felices",
            tipoOrganizacion: "fundacion",
            ubicacion: {
                coordenadas: {
                    latitud: 19.4326,
                    longitud: -99.1332
                },
                direccion: "Av. Insurgentes #123, CDMX"
            },
            mascotasDisponibles: 15,
            tiposMascotas: ["perro", "gato"],
            verificada: true
        },
        {
            id: 2,
            nombreOrganizacion: "Refugio Esperanza",
            tipoOrganizacion: "refugio",
            ubicacion: {
                coordenadas: {
                    latitud: 20.6597,
                    longitud: -103.3496
                },
                direccion: "Carretera Nacional Km 25, Guadalajara"
            },
            mascotasDisponibles: 8,
            tiposMascotas: ["perro"],
            verificada: true
        }
    ];
}

// ========================================
//   REGISTRAR NUEVA ORGANIZACIÓN
// ========================================

router.post('/registrar', async (req, res) => {
    try {
        console.log('📝 Recibiendo solicitud de registro de organización');
        
        // Si no hay MySQL, simular éxito
        if (global.useMockData) {
            const numeroSolicitud = 'ORG-' + Date.now().toString().slice(-6);
            console.log('✅ Registro simulado exitoso:', numeroSolicitud);
            
            return res.status(201).json({
                success: true,
                mensaje: 'Solicitud de registro recibida exitosamente',
                numeroSolicitud: numeroSolicitud,
                estado: 'pendiente_revision',
                tiempoEstimado: '2-3 días hábiles'
            });
        }

        // Extraer datos del formulario
        const {
            nombreOrganizacion,
            tipoOrganizacion,
            mision,
            vision,
            añoFundacion,
            numeroMascotas,
            personaContacto,
            cargoContacto,
            emailContacto,
            telefonoContacto,
            direccion,
            sitioWeb,
            redesSociales,
            registroOficial
        } = req.body;

        // Validar campos requeridos
        if (!nombreOrganizacion || !emailContacto || !personaContacto) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos',
                campos: ['nombreOrganizacion', 'emailContacto', 'personaContacto']
            });
        }

        // Verificar si ya existe una organización con el mismo email
        const organizacionExistente = await Organizacion.findOne({
            where: { emailContacto: emailContacto }
        });

        if (organizacionExistente) {
            return res.status(409).json({
                success: false,
                error: 'Ya existe una organización registrada con este email'
            });
        }

        // Crear nueva organización
        const nuevaOrganizacion = await Organizacion.create({
            nombre: nombreOrganizacion,
            tipoOrganizacion: tipoOrganizacion || 'refugio',
            descripcion: mision || '',
            mision: mision || '',
            vision: vision || '',
            añoFundacion: añoFundacion ? parseInt(añoFundacion) : null,
            personaContacto,
            cargoContacto,
            emailContacto,
            telefonoContacto,
            ubicacion: {
                direccion: direccion || '',
                ciudad: '',
                estado: '',
                pais: 'México'
            },
            sitioWeb: sitioWeb || null,
            redesSociales: redesSociales || null,
            registroOficial: registroOficial || null,
            numeroMascotas: numeroMascotas ? parseInt(numeroMascotas) : 0,
            verificada: false,
            activa: false, // Requiere aprobación admin
            fechaRegistro: new Date()
        });

        const numeroSolicitud = 'ORG-' + nuevaOrganizacion.id.toString().padStart(6, '0');

        console.log('✅ Organización registrada exitosamente:', {
            id: nuevaOrganizacion.id,
            nombre: nombreOrganizacion,
            numeroSolicitud
        });

        res.status(201).json({
            success: true,
            mensaje: 'Solicitud de registro recibida exitosamente',
            numeroSolicitud: numeroSolicitud,
            organizacionId: nuevaOrganizacion.id,
            estado: 'pendiente_revision',
            tiempoEstimado: '2-3 días hábiles'
        });

    } catch (error) {
        console.error('❌ Error al registrar organización:', error);
        
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            mensaje: 'No se pudo procesar la solicitud de registro'
        });
    }
});

module.exports = router;