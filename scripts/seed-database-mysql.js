// ========================================
//   SCRIPT DE SEEDING - BASE DE DATOS MYSQL
// ========================================

const { sequelize, Usuario, Organizacion, Mascota, SolicitudAdopcion } = require('../server/database-mysql');

async function seedDatabase() {
    console.log('🔄 Iniciando proceso de seeding de la base de datos...');

    try {
        // Sincronizar base de datos (crear tablas si no existen)
        await sequelize.sync({ force: true }); // force: true elimina y recrea las tablas
        console.log('✅ Tablas sincronizadas correctamente');

        // ========================================
        //   CREAR USUARIOS DE PRUEBA
        // ========================================

        console.log('👥 Creando usuarios de prueba...');

        const usuarios = await Usuario.bulkCreate([
            {
                nombreCompleto: 'Juan Pérez González',
                email: 'juan.perez@email.com',
                password: 'hashedpassword123', // En producción esto sería un hash real
                telefono: '+52 555 123 4567',
                fechaNacimiento: '1990-05-15',
                ubicacion: {
                    direccion: 'Calle Reforma #123',
                    ciudad: 'Ciudad de México',
                    estado: 'CDMX',
                    codigoPostal: '06700'
                },
                experienciaConMascotas: 'Tuve un perro Golden Retriever durante 12 años',
                tipoVivienda: 'casa',
                verificado: true,
                fechaRegistro: new Date('2023-06-15')
            },
            {
                nombreCompleto: 'Ana Rodríguez López',
                email: 'ana.rodriguez@email.com',
                password: 'hashedpassword456',
                telefono: '+52 555 987 6543',
                fechaNacimiento: '1985-09-22',
                ubicacion: {
                    direccion: 'Av. Universidad #456',
                    ciudad: 'Guadalajara',
                    estado: 'Jalisco',
                    codigoPostal: '44100'
                },
                experienciaConMascotas: 'Primera vez adoptando, pero amo los animales',
                tipoVivienda: 'departamento',
                verificado: true,
                fechaRegistro: new Date('2023-08-10')
            },
            {
                nombreCompleto: 'Carlos García Mendoza',
                email: 'carlos.garcia@email.com',
                password: 'hashedpassword789',
                telefono: '+52 555 456 7890',
                fechaNacimiento: '1992-03-08',
                ubicacion: {
                    direccion: 'Blvd. Díaz Ordaz #789',
                    ciudad: 'Monterrey',
                    estado: 'Nuevo León',
                    codigoPostal: '64000'
                },
                experienciaConMascotas: 'He tenido gatos toda mi vida',
                tipoVivienda: 'casa',
                verificado: false,
                fechaRegistro: new Date('2024-01-05')
            }
        ]);

        console.log(`✅ ${usuarios.length} usuarios creados`);

        // ========================================
        //   CREAR ORGANIZACIONES DE PRUEBA
        // ========================================

        console.log('🏢 Creando organizaciones de prueba...');

        const organizaciones = await Organizacion.bulkCreate([
            {
                nombreOrganizacion: 'Fundación Patitas Felices',
                tipoOrganizacion: 'fundacion',
                descripcion: 'Dedicados al rescate, rehabilitación y adopción responsable de perros y gatos en situación de calle. Trabajamos con veterinarios especializados para garantizar la salud de nuestros rescatados.',
                email: 'contacto@patitasfelices.org',
                password: 'hashedorgpassword123',
                telefono: '+52 555 123 4567',
                ubicacion: {
                    direccion: 'Av. Insurgentes Sur #123',
                    ciudad: 'Ciudad de México',
                    estado: 'CDMX',
                    codigoPostal: '03100',
                    coordenadas: {
                        latitud: 19.4326,
                        longitud: -99.1332
                    }
                },
                servicios: {
                    adopciones: true,
                    esterilizacion: true,
                    atencionVeterinaria: true,
                    rescateEmergencia: true,
                    programasEducativos: true
                },
                horarioAtencion: {
                    lunes: '9:00-17:00',
                    martes: '9:00-17:00',
                    miercoles: '9:00-17:00',
                    jueves: '9:00-17:00',
                    viernes: '9:00-17:00',
                    sabado: '10:00-15:00',
                    domingo: 'Cerrado'
                },
                verificada: true,
                activa: true,
                fechaRegistro: new Date('2023-01-15'),
                estadisticas: {
                    rescatados: 156,
                    adoptados: 98,
                    esterilizados: 203
                }
            },
            {
                nombreOrganizacion: 'Refugio Esperanza',
                tipoOrganizacion: 'refugio',
                descripcion: 'Refugio especializado en la rehabilitación de perros rescatados. Contamos con amplias instalaciones y un equipo de entrenadores profesionales.',
                email: 'info@refugioesperanza.com',
                password: 'hashedorgpassword456',
                telefono: '+52 333 987 6543',
                ubicacion: {
                    direccion: 'Carretera Nacional Km 25',
                    ciudad: 'Guadalajara',
                    estado: 'Jalisco',
                    codigoPostal: '45520',
                    coordenadas: {
                        latitud: 20.6597,
                        longitud: -103.3496
                    }
                },
                servicios: {
                    adopciones: true,
                    rescateEmergencia: true,
                    albergueTemporol: true,
                    entrenamientoCanino: true
                },
                horarioAtencion: {
                    lunes: '8:00-16:00',
                    martes: '8:00-16:00',
                    miercoles: '8:00-16:00',
                    jueves: '8:00-16:00',
                    viernes: '8:00-16:00',
                    sabado: '9:00-14:00',
                    domingo: '9:00-14:00'
                },
                verificada: true,
                activa: true,
                fechaRegistro: new Date('2023-03-20'),
                estadisticas: {
                    rescatados: 89,
                    adoptados: 67,
                    esterilizados: 89
                }
            },
            {
                nombreOrganizacion: 'Gatitos Sin Hogar MTY',
                tipoOrganizacion: 'asociacion',
                descripcion: 'Asociación civil enfocada en el rescate y adopción de gatos. También promovemos la esterilización para controlar la sobrepoblación felina.',
                email: 'gatitossinhogar@email.com',
                password: 'hashedorgpassword789',
                telefono: '+52 811 456 7890',
                ubicacion: {
                    direccion: 'Av. Constitución #456',
                    ciudad: 'Monterrey',
                    estado: 'Nuevo León',
                    codigoPostal: '64000',
                    coordenadas: {
                        latitud: 25.6866,
                        longitud: -100.3161
                    }
                },
                servicios: {
                    adopciones: true,
                    esterilizacion: true,
                    atencionVeterinaria: false,
                    rescateEmergencia: true
                },
                horarioAtencion: {
                    lunes: '10:00-18:00',
                    martes: '10:00-18:00',
                    miercoles: '10:00-18:00',
                    jueves: '10:00-18:00',
                    viernes: '10:00-18:00',
                    sabado: '10:00-16:00',
                    domingo: 'Cerrado'
                },
                verificada: false,
                activa: true,
                fechaRegistro: new Date('2023-09-10'),
                estadisticas: {
                    rescatados: 45,
                    adoptados: 23,
                    esterilizados: 67
                }
            }
        ]);

        console.log(`✅ ${organizaciones.length} organizaciones creadas`);

        // ========================================
        //   CREAR MASCOTAS DE PRUEBA
        // ========================================

        console.log('🐕 Creando mascotas de prueba...');

        const mascotas = await Mascota.bulkCreate([
            {
                nombre: 'Luna',
                tipo: 'perro',
                raza: 'Golden Retriever',
                edad: 3,
                sexo: 'hembra',
                tamaño: 'grande',
                peso: 28.5,
                color: 'Dorado',
                descripcion: 'Luna es una perra muy cariñosa y juguetona. Le encanta nadar y jugar con pelotas. Es perfecta para familias con niños.',
                personalidad: ['cariñosa', 'juguetona', 'obediente', 'energética'],
                necesidadesEspeciales: 'Requiere ejercicio diario y le gusta nadar',
                estado: 'disponible',
                esterilizado: true,
                vacunas: {
                    rabia: true,
                    parvovirus: true,
                    moquillo: true,
                    hepatitis: true,
                    ultimaActualizacion: '2024-01-15'
                },
                historialMedico: 'Chequeo general realizado. Saludable.',
                organizacionId: organizaciones[0].id,
                imagenes: ['/assets/images/luna1.jpg', '/assets/images/luna2.jpg'],
                imagenPrincipal: '/assets/images/luna1.jpg',
                fechaIngreso: new Date('2024-01-10'),
                fechaRescate: new Date('2023-12-20')
            },
            {
                nombre: 'Max',
                tipo: 'perro',
                raza: 'Pastor Alemán',
                edad: 5,
                sexo: 'macho',
                tamaño: 'grande',
                peso: 35.0,
                color: 'Negro y café',
                descripcion: 'Max es un perro muy inteligente y leal. Ha recibido entrenamiento básico y es excelente como perro guardián.',
                personalidad: ['leal', 'inteligente', 'protector', 'obediente'],
                necesidadesEspeciales: 'Necesita dueño con experiencia en perros grandes',
                estado: 'disponible',
                esterilizado: true,
                vacunas: {
                    rabia: true,
                    parvovirus: true,
                    moquillo: true,
                    hepatitis: true,
                    ultimaActualizacion: '2024-01-10'
                },
                historialMedico: 'Displasia leve de cadera, bajo tratamiento.',
                organizacionId: organizaciones[1].id,
                imagenes: ['/assets/images/max1.jpg', '/assets/images/max2.jpg'],
                imagenPrincipal: '/assets/images/max1.jpg',
                fechaIngreso: new Date('2024-01-05'),
                fechaRescate: new Date('2023-11-15')
            },
            {
                nombre: 'Mía',
                tipo: 'gato',
                raza: 'Siamés',
                edad: 2,
                sexo: 'hembra',
                tamaño: 'mediano',
                peso: 4.2,
                color: 'Crema con puntos oscuros',
                descripcion: 'Mía es una gata muy elegante y cariñosa. Le gusta la tranquilidad pero también disfruta jugar con juguetes.',
                personalidad: ['tranquila', 'cariñosa', 'independiente', 'elegante'],
                necesidadesEspeciales: 'Prefiere ambientes tranquilos',
                estado: 'disponible',
                esterilizado: true,
                vacunas: {
                    rabia: true,
                    leucemia: true,
                    calicivirus: true,
                    panleucopenia: true,
                    ultimaActualizacion: '2024-01-08'
                },
                historialMedico: 'Saludable, sin problemas médicos.',
                organizacionId: organizaciones[2].id,
                imagenes: ['/assets/images/mia1.jpg', '/assets/images/mia2.jpg'],
                imagenPrincipal: '/assets/images/mia1.jpg',
                fechaIngreso: new Date('2024-01-08'),
                fechaRescate: new Date('2023-12-05')
            },
            {
                nombre: 'Rocky',
                tipo: 'perro',
                raza: 'Pitbull',
                edad: 4,
                sexo: 'macho',
                tamaño: 'mediano',
                peso: 25.8,
                color: 'Café con blanco',
                descripcion: 'Rocky es muy dulce y cariñoso, contrario a los estereotipos de su raza. Le encanta jugar y recibir cariño.',
                personalidad: ['dulce', 'cariñoso', 'juguetón', 'sociable'],
                necesidadesEspeciales: 'Necesita socialización con otros perros',
                estado: 'en_proceso_adopcion',
                esterilizado: true,
                vacunas: {
                    rabia: true,
                    parvovirus: true,
                    moquillo: true,
                    hepatitis: true,
                    ultimaActualizacion: '2024-01-12'
                },
                historialMedico: 'Cicatriz en oreja izquierda de rescate.',
                organizacionId: organizaciones[0].id,
                imagenes: ['/assets/images/rocky1.jpg'],
                imagenPrincipal: '/assets/images/rocky1.jpg',
                fechaIngreso: new Date('2023-12-15'),
                fechaRescate: new Date('2023-11-30')
            },
            {
                nombre: 'Whiskers',
                tipo: 'gato',
                raza: 'Mestizo',
                edad: 1,
                sexo: 'macho',
                tamaño: 'pequeño',
                peso: 3.1,
                color: 'Gris atigrado',
                descripcion: 'Whiskers es un gatito muy juguetón y curioso. Le encanta explorar y trepar por todos lados.',
                personalidad: ['juguetón', 'curioso', 'activo', 'aventurero'],
                necesidadesEspeciales: 'Necesita muchos juguetes y entretenimiento',
                estado: 'disponible',
                esterilizado: true,
                vacunas: {
                    rabia: false,
                    leucemia: true,
                    calicivirus: true,
                    panleucopenia: true,
                    ultimaActualizacion: '2024-01-14'
                },
                historialMedico: 'Gatito joven, saludable. Pendiente vacuna rabia.',
                organizacionId: organizaciones[2].id,
                imagenes: ['/assets/images/whiskers1.jpg', '/assets/images/whiskers2.jpg'],
                imagenPrincipal: '/assets/images/whiskers1.jpg',
                fechaIngreso: new Date('2024-01-14'),
                fechaRescate: new Date('2024-01-10')
            },
            {
                nombre: 'Bella',
                tipo: 'perro',
                raza: 'Labrador Retriever',
                edad: 6,
                sexo: 'hembra',
                tamaño: 'grande',
                peso: 30.2,
                color: 'Chocolate',
                descripcion: 'Bella es una perra madura y muy tranquila. Perfecta para personas que buscan un compañero calmado y fiel.',
                personalidad: ['tranquila', 'fiel', 'madura', 'obediente'],
                necesidadesEspeciales: 'Requiere ejercicio moderado por su edad',
                estado: 'adoptado',
                esterilizado: true,
                vacunas: {
                    rabia: true,
                    parvovirus: true,
                    moquillo: true,
                    hepatitis: true,
                    ultimaActualizacion: '2023-12-20'
                },
                historialMedico: 'Artritis leve, tratamiento con suplementos.',
                organizacionId: organizaciones[1].id,
                imagenes: ['/assets/images/bella1.jpg'],
                imagenPrincipal: '/assets/images/bella1.jpg',
                fechaIngreso: new Date('2023-11-20'),
                fechaRescate: new Date('2023-10-15'),
                fechaAdopcion: new Date('2024-01-20')
            }
        ]);

        console.log(`✅ ${mascotas.length} mascotas creadas`);

        // ========================================
        //   CREAR SOLICITUDES DE ADOPCIÓN
        // ========================================

        console.log('📋 Creando solicitudes de adopción de prueba...');

        const solicitudes = await SolicitudAdopcion.bulkCreate([
            {
                usuarioId: usuarios[0].id,
                mascotaId: mascotas[3].id, // Rocky - en proceso
                organizacionId: organizaciones[0].id,
                estado: 'aprobada',
                tipoVivienda: 'casa',
                experienciaMascotas: 'Tuve un Golden Retriever durante 12 años llamado Buddy',
                motivoAdopcion: 'Busco un compañero fiel para mi familia. Tenemos un jardín grande y mucho amor para dar.',
                disponibilidadTiempo: 'Trabajo desde casa, por lo que puedo dedicarle tiempo completo',
                contactoEmergencia: {
                    nombre: 'María Pérez',
                    telefono: '+52 555 987 6543',
                    relacion: 'Esposa'
                },
                comentariosAdicionales: 'Tenemos experiencia con perros grandes y estamos preparados para darle mucho ejercicio y cariño.',
                fechaSolicitud: new Date('2024-01-18'),
                fechaActualizacion: new Date('2024-01-20'),
                comentarios: 'Familia ideal para Rocky. Casa con jardín y experiencia previa.'
            },
            {
                usuarioId: usuarios[1].id,
                mascotaId: mascotas[0].id, // Luna
                organizacionId: organizaciones[0].id,
                estado: 'pendiente',
                tipoVivienda: 'departamento',
                experienciaMascotas: 'Primera vez adoptando, pero he cuidado perros de amigos',
                motivoAdopcion: 'Quiero ayudar a un animal rescatado y tener un compañero leal',
                disponibilidadTiempo: 'Trabajo medio tiempo, tengo tardes libres para paseos y juegos',
                contactoEmergencia: {
                    nombre: 'Carlos Rodríguez',
                    telefono: '+52 555 123 4567',
                    relacion: 'Hermano'
                },
                comentariosAdicionales: 'Vivo cerca de un parque donde puedo llevarla a correr y jugar.',
                fechaSolicitud: new Date('2024-01-22')
            },
            {
                usuarioId: usuarios[2].id,
                mascotaId: mascotas[2].id, // Mía
                organizacionId: organizaciones[2].id,
                estado: 'en_revision',
                tipoVivienda: 'casa',
                experienciaMascotas: 'He tenido gatos toda mi vida, actualmente tengo dos',
                motivoAdopcion: 'Quiero darle una oportunidad a un gato rescatado',
                disponibilidadTiempo: 'Trabajo en casa, por lo que puedo estar siempre disponible',
                contactoEmergencia: {
                    nombre: 'Luis García',
                    telefono: '+52 555 456 7890',
                    relacion: 'Padre'
                },
                comentariosAdicionales: 'Tengo experiencia con gatos siameses y entiendo sus necesidades especiales.',
                fechaSolicitud: new Date('2024-01-20'),
                fechaActualizacion: new Date('2024-01-21'),
                comentarios: 'Solicitante con experiencia. Revisando compatibilidad con otros gatos.'
            }
        ]);

        console.log(`✅ ${solicitudes.length} solicitudes de adopción creadas`);

        // ========================================
        //   RESUMEN FINAL
        // ========================================

        console.log('\n🎉 ¡Seeding completado exitosamente!');
        console.log('=====================================');
        console.log(`👥 Usuarios creados: ${usuarios.length}`);
        console.log(`🏢 Organizaciones creadas: ${organizaciones.length}`);
        console.log(`🐕 Mascotas creadas: ${mascotas.length}`);
        console.log(`📋 Solicitudes creadas: ${solicitudes.length}`);
        console.log('=====================================');
        
        console.log('\n📊 Estado de las mascotas:');
        const estadosMascotas = mascotas.reduce((acc, mascota) => {
            acc[mascota.estado] = (acc[mascota.estado] || 0) + 1;
            return acc;
        }, {});
        
        Object.entries(estadosMascotas).forEach(([estado, cantidad]) => {
            console.log(`   ${estado}: ${cantidad}`);
        });

        console.log('\n📊 Estado de las solicitudes:');
        const estadosSolicitudes = solicitudes.reduce((acc, solicitud) => {
            acc[solicitud.estado] = (acc[solicitud.estado] || 0) + 1;
            return acc;
        }, {});
        
        Object.entries(estadosSolicitudes).forEach(([estado, cantidad]) => {
            console.log(`   ${estado}: ${cantidad}`);
        });

        console.log('\n✅ La base de datos está lista para usar!');

    } catch (error) {
        console.error('❌ Error durante el seeding:', error);
        throw error;
    }
}

// Ejecutar el seeding si este archivo se ejecuta directamente
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('🔚 Proceso de seeding finalizado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Error fatal durante el seeding:', error);
            process.exit(1);
        });
}

module.exports = { seedDatabase };