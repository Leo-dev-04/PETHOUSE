// ========================================
//   RUTAS DE AUTENTICACIÓN - MYSQL
// ========================================

const express = require('express');
const jwt = require('jsonwebtoken');
const { Usuario, Organizacion } = require('../models-mysql');

const router = express.Router();

// ========================================
//   REGISTRO DE USUARIO
// ========================================

router.post('/registro', async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            email,
            password,
            telefono,
            terminos
        } = req.body;

        // Validaciones básicas
        if (!nombre || !apellido || !email || !password || !telefono) {
            return res.status(400).json({
                error: 'Todos los campos obligatorios deben ser completados'
            });
        }

        if (!terminos) {
            return res.status(400).json({
                error: 'Debes aceptar los términos y condiciones'
            });
        }

        // Si no hay MySQL disponible, usar datos mock
        if (global.useMockData) {
            const usuarioMock = {
                id: Date.now(),
                nombre,
                apellido,
                email: email.toLowerCase(),
                telefono,
                fechaRegistro: new Date()
            };

            const token = jwt.sign(
                { userId: usuarioMock.id, email: usuarioMock.email, tipo: 'usuario' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            return res.status(201).json({
                message: 'Usuario registrado exitosamente (modo mock)',
                usuario: usuarioMock,
                token
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findByEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({
                error: 'Ya existe una cuenta con este email'
            });
        }

        // Crear nuevo usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            email: email.toLowerCase(),
            password,
            telefono
        });

        // Generar token JWT
        const token = jwt.sign(
            { 
                userId: nuevoUsuario.id,
                email: nuevoUsuario.email,
                tipo: 'usuario'
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: nuevoUsuario.getPerfilPublico(),
            token
        });

    } catch (error) {
        console.error('Error en registro:', error);
        
        if (error.name === 'SequelizeValidationError') {
            const errores = error.errors.map(err => err.message);
            return res.status(400).json({
                error: 'Datos inválidos',
                detalles: errores
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: 'Este email ya está registrado'
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   LOGIN DE USUARIO
// ========================================

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones básicas
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son requeridos'
            });
        }

        // Si no hay MySQL, usar datos mock
        if (global.useMockData) {
            if (email === 'demo@pethouse.com' && password === '123456') {
                const usuarioMock = {
                    id: 1,
                    nombre: 'Usuario',
                    apellido: 'Demo',
                    email: 'demo@pethouse.com',
                    telefono: '+52 555 000 0000',
                    verificado: true
                };

                const token = jwt.sign(
                    { userId: 1, email: usuarioMock.email, tipo: 'usuario' },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRE }
                );

                return res.json({
                    message: 'Login exitoso (modo mock)',
                    usuario: usuarioMock,
                    token
                });
            } else {
                return res.status(401).json({
                    error: 'Credenciales inválidas. Prueba: demo@pethouse.com / 123456'
                });
            }
        }

        // Buscar usuario
        const usuario = await Usuario.findByEmail(email);
        if (!usuario) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordValido = await usuario.compararPassword(password);
        if (!passwordValido) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verificar si la cuenta está activa
        if (!usuario.activo) {
            return res.status(401).json({
                error: 'Cuenta desactivada. Contacta al soporte.'
            });
        }

        // Actualizar último acceso
        usuario.ultimoAcceso = new Date();
        await usuario.save();

        // Generar token JWT
        const token = jwt.sign(
            { 
                userId: usuario.id,
                email: usuario.email,
                tipo: 'usuario'
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            message: 'Login exitoso',
            usuario: usuario.getPerfilPublico(),
            token
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   REGISTRO DE ORGANIZACIÓN
// ========================================

router.post('/registro-organizacion', async (req, res) => {
    try {
        const organizacionData = req.body;

        // Validaciones básicas
        const camposRequeridos = [
            'nombreOrganizacion',
            'tipoOrganizacion',
            'descripcion',
            'personaContacto',
            'email',
            'telefono'
        ];

        for (let campo of camposRequeridos) {
            if (!organizacionData[campo]) {
                return res.status(400).json({
                    error: `El campo ${campo} es requerido`
                });
            }
        }

        // Si no hay MySQL, simular respuesta
        if (global.useMockData) {
            return res.status(201).json({
                message: 'Organización registrada exitosamente (modo mock)',
                organizacion: {
                    id: Date.now(),
                    nombre: organizacionData.nombreOrganizacion,
                    email: organizacionData.email,
                    verificada: false
                },
                nota: 'Tu organización será revisada y verificada en las próximas 48 horas'
            });
        }

        // Verificar si la organización ya existe
        const orgExistente = await Organizacion.findOne({ 
            where: { email: organizacionData.email.toLowerCase() }
        });
        
        if (orgExistente) {
            return res.status(400).json({
                error: 'Ya existe una organización registrada con este email'
            });
        }

        // Crear nueva organización
        const nuevaOrganizacion = await Organizacion.create({
            ...organizacionData,
            email: organizacionData.email.toLowerCase()
        });

        res.status(201).json({
            message: 'Organización registrada exitosamente',
            organizacion: nuevaOrganizacion.getInfoBasica(),
            nota: 'Tu organización será revisada y verificada en las próximas 48 horas'
        });

    } catch (error) {
        console.error('Error en registro de organización:', error);
        
        if (error.name === 'SequelizeValidationError') {
            const errores = error.errors.map(err => err.message);
            return res.status(400).json({
                error: 'Datos inválidos',
                detalles: errores
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
});

// ========================================
//   MIDDLEWARE DE AUTENTICACIÓN
// ========================================

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Acceso denegado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (global.useMockData) {
            req.usuario = {
                id: decoded.userId,
                email: decoded.email,
                nombre: 'Usuario Demo'
            };
            return next();
        }

        const usuario = await Usuario.findByPk(decoded.userId);
        if (!usuario) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// ========================================
//   VERIFICAR TOKEN
// ========================================

router.get('/verificar', auth, async (req, res) => {
    res.json({
        valido: true,
        usuario: global.useMockData ? req.usuario : req.usuario.getPerfilPublico()
    });
});

// ========================================
//   PERFIL DE USUARIO
// ========================================

router.get('/perfil', auth, async (req, res) => {
    res.json({
        usuario: global.useMockData ? req.usuario : req.usuario.getPerfilPublico()
    });
});

module.exports = router;