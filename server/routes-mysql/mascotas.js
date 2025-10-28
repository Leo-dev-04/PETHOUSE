// ========================================
//   RUTAS DE MASCOTAS - MYSQL
// ========================================

const express = require('express');
const { Mascota, Organizacion } = require('../models-mysql');
const { Op } = require('sequelize');

const router = express.Router();

// ========================================
//   OBTENER TODAS LAS MASCOTAS
// ========================================

router.get('/', async (req, res) => {
    try {
        // Si no hay MySQL, usar datos mock
        if (global.useMockData) {
            return res.json({
                mascotas: getMockMascotas(),
                pagination: {
                    current: 1,
                    total: 1,
                    count: getMockMascotas().length,
                    totalMascotas: getMockMascotas().length
                }
            });
        }

        const {
            tipo,
            edad,
            tamaño,
            genero,
            ciudad,
            estado,
            urgente,
            destacado,
            limit = 20,
            page = 1,
            sort = 'fechaIngreso'
        } = req.query;

        // Construir filtros
        const filtros = { estado: 'disponible' };

        if (tipo) filtros.tipo = tipo;
        if (edad) filtros['edad.categoria'] = edad;
        if (tamaño) filtros.tamaño = tamaño;
        if (genero) filtros.genero = genero;
        if (urgente === 'true') filtros.urgente = true;
        if (destacado === 'true') filtros.destacado = true;

        // Filtros de ubicación JSON
        if (ciudad) {
            filtros['$ubicacion.ciudad$'] = { [Op.like]: `%${ciudad}%` };
        }

        // Paginación
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Orden
        let order = [['fechaIngreso', 'DESC']];
        if (sort === 'nombre') order = [['nombre', 'ASC']];
        if (sort === 'edad') order = [['edad', 'ASC']];

        // Buscar mascotas
        const { count, rows: mascotas } = await Mascota.findAndCountAll({
            where: filtros,
            include: [{
                model: Organizacion,
                as: 'Organizacion',
                attributes: ['id', 'nombreOrganizacion', 'email', 'telefono', 'ubicacion']
            }],
            order,
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
        console.error('Error obteniendo mascotas:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   OBTENER MASCOTA POR ID
// ========================================

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Si no hay MySQL, usar datos mock
        if (global.useMockData) {
            const mockData = getMockMascotas();
            const mascota = mockData.find(m => m.id === parseInt(id));
            
            if (!mascota) {
                return res.status(404).json({ error: 'Mascota no encontrada' });
            }
            
            return res.json(mascota);
        }

        const mascota = await Mascota.findByPk(id, {
            include: [{
                model: Organizacion,
                as: 'Organizacion',
                attributes: ['id', 'nombreOrganizacion', 'email', 'telefono', 'ubicacion', 'servicios', 'horarios']
            }]
        });

        if (!mascota) {
            return res.status(404).json({
                error: 'Mascota no encontrada'
            });
        }

        // Incrementar contador de vistas
        await mascota.incrementarVistas();

        res.json(mascota);

    } catch (error) {
        console.error('Error obteniendo mascota:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'ID de mascota inválido'
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   BUSCAR MASCOTAS
// ========================================

router.get('/buscar/:termino', async (req, res) => {
    try {
        const { termino } = req.params;
        
        if (global.useMockData) {
            const mockData = getMockMascotas();
            const resultados = mockData.filter(m => 
                m.nombre.toLowerCase().includes(termino.toLowerCase()) ||
                m.raza.toLowerCase().includes(termino.toLowerCase()) ||
                m.descripcion.toLowerCase().includes(termino.toLowerCase())
            );
            return res.json(resultados);
        }

        const mascotas = await Mascota.findAll({
            where: {
                estado: 'disponible',
                [Op.or]: [
                    { nombre: { [Op.like]: `%${termino}%` } },
                    { raza: { [Op.like]: `%${termino}%` } },
                    { descripcion: { [Op.like]: `%${termino}%` } }
                ]
            },
            include: [{
                model: Organizacion,
                as: 'Organizacion',
                attributes: ['nombreOrganizacion', 'ubicacion']
            }],
            limit: 20
        });

        res.json(mascotas);

    } catch (error) {
        console.error('Error en búsqueda:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   ESTADÍSTICAS
// ========================================

router.get('/stats/general', async (req, res) => {
    try {
        if (global.useMockData) {
            const mockData = getMockMascotas();
            return res.json({
                general: {
                    total: mockData.length,
                    disponibles: mockData.filter(m => m.estado === 'disponible').length,
                    adoptados: mockData.filter(m => m.estado === 'adoptado').length
                },
                porTipo: {
                    perro: mockData.filter(m => m.tipo === 'perro').length,
                    gato: mockData.filter(m => m.tipo === 'gato').length,
                    otro: mockData.filter(m => !['perro', 'gato'].includes(m.tipo)).length
                }
            });
        }

        // Estadísticas generales
        const total = await Mascota.count();
        const disponibles = await Mascota.count({ where: { estado: 'disponible' } });
        const adoptados = await Mascota.count({ where: { estado: 'adoptado' } });

        // Estadísticas por tipo
        const statsPorTipo = await Mascota.findAll({
            where: { estado: 'disponible' },
            attributes: [
                'tipo',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
            ],
            group: ['tipo']
        });

        const porTipo = statsPorTipo.reduce((acc, item) => {
            acc[item.tipo] = parseInt(item.dataValues.count);
            return acc;
        }, {});

        res.json({
            general: { total, disponibles, adoptados },
            porTipo
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

function getMockMascotas() {
    return [
        {
            id: 1,
            nombre: "Luna",
            tipo: "perro",
            raza: "Golden Retriever",
            edad: { años: 2, categoria: "joven" },
            genero: "hembra",
            tamaño: "grande",
            peso: { valor: 28, unidad: "kg" },
            personalidad: ["cariñosa", "juguetona", "inteligente"],
            descripcion: "Luna es una perra increíblemente dulce y cariñosa. Le encanta jugar con niños y otros perros.",
            imagenes: ["assets/images/perro.png"],
            imagenPrincipal: "assets/images/perro.png",
            estado: "disponible",
            salud: {
                vacunado: true,
                esterilizado: true,
                microchip: true
            },
            compatibilidad: {
                niños: true,
                otrasmascotas: true,
                apartamento: true
            },
            Organizacion: {
                id: 1,
                nombreOrganizacion: "Fundación Patitas Felices",
                email: "contacto@patitasfelices.org",
                telefono: "+52 555 123 4567"
            },
            fechaIngreso: "2024-01-15",
            urgente: false,
            destacado: true
        },
        {
            id: 2,
            nombre: "Max",
            tipo: "perro",
            raza: "Pastor Alemán",
            edad: { años: 3, categoria: "adulto" },
            genero: "macho",
            tamaño: "grande",
            peso: { valor: 32, unidad: "kg" },
            personalidad: ["leal", "protector", "inteligente"],
            descripcion: "Max es un perro noble y leal, perfecto para familias que buscan un compañero protector.",
            imagenes: ["assets/images/perro2.webp"],
            imagenPrincipal: "assets/images/perro2.webp",
            estado: "disponible",
            salud: {
                vacunado: true,
                esterilizado: true,
                microchip: true
            },
            compatibilidad: {
                niños: true,
                otrasmascotas: false,
                apartamento: false
            },
            Organizacion: {
                id: 2,
                nombreOrganizacion: "Refugio Esperanza",
                email: "info@refugioesperanza.com",
                telefono: "+52 555 987 6543"
            },
            fechaIngreso: "2024-02-20",
            urgente: false,
            destacado: false
        },
        {
            id: 3,
            nombre: "Mía",
            tipo: "gato",
            raza: "Siamés",
            edad: { meses: 8, categoria: "joven" },
            genero: "hembra",
            tamaño: "pequeño",
            peso: { valor: 3.5, unidad: "kg" },
            personalidad: ["vocal", "inteligente", "activa"],
            descripcion: "Mía es una gata siamesa muy vocal e inteligente. Le gusta 'conversar' con sus humanos.",
            imagenes: ["assets/images/gata.jpg"],
            imagenPrincipal: "assets/images/gata.jpg",
            estado: "disponible",
            salud: {
                vacunado: true,
                esterilizado: true,
                microchip: true
            },
            compatibilidad: {
                niños: false,
                otrasmascotas: true,
                apartamento: true
            },
            Organizacion: {
                id: 3,
                nombreOrganizacion: "Gatos en Adopción",
                email: "adopciones@gatitos.org",
                telefono: "+52 555 456 7890"
            },
            fechaIngreso: "2024-03-10",
            urgente: false,
            destacado: false
        }
    ];
}

module.exports = router;