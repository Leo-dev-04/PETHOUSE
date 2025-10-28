/**
 * API para gestión de organizaciones
 * Funciones para registro y administración de organizaciones
 */

class OrganizacionesAPI {
    constructor() {
        this.baseURL = '/api/organizaciones';
    }

    /**
     * Registra una nueva organización
     * @param {FormData} formData - Datos del formulario de registro
     * @returns {Promise} - Respuesta del servidor
     */
    async registrarOrganizacion(formData) {
        try {
            const response = await fetch(`${this.baseURL}/registrar`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al registrar organización:', error);
            throw error;
        }
    }

    /**
     * Obtiene las organizaciones verificadas
     * @returns {Promise} - Lista de organizaciones
     */
    async obtenerOrganizaciones() {
        try {
            const response = await fetch(this.baseURL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener organizaciones:', error);
            throw error;
        }
    }

    /**
     * Obtiene una organización por ID
     * @param {string} id - ID de la organización
     * @returns {Promise} - Datos de la organización
     */
    async obtenerOrganizacionPorId(id) {
        try {
            const response = await fetch(`${this.baseURL}/${id}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener organización:', error);
            throw error;
        }
    }

    /**
     * Valida los archivos antes de enviar
     * @param {FileList} files - Archivos a validar
     * @returns {boolean} - true si son válidos
     */
    validarArchivos(files) {
        const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const tamañoMaximo = 5 * 1024 * 1024; // 5MB

        for (let file of files) {
            if (!tiposPermitidos.includes(file.type)) {
                alert(`Tipo de archivo no permitido: ${file.name}`);
                return false;
            }
            
            if (file.size > tamañoMaximo) {
                alert(`Archivo muy grande: ${file.name}. Máximo 5MB.`);
                return false;
            }
        }

        return true;
    }

    /**
     * Prepara FormData con validación
     * @param {Object} datos - Datos del formulario
     * @param {Object} archivos - Archivos del formulario
     * @returns {FormData} - FormData preparado
     */
    prepararFormData(datos, archivos) {
        const formData = new FormData();

        // Agregar datos de texto
        Object.keys(datos).forEach(key => {
            if (datos[key] !== null && datos[key] !== undefined) {
                formData.append(key, datos[key]);
            }
        });

        // Agregar archivos si existen
        if (archivos.actaConstitutiva && archivos.actaConstitutiva.files[0]) {
            formData.append('actaConstitutiva', archivos.actaConstitutiva.files[0]);
        }

        if (archivos.identificacion && archivos.identificacion.files[0]) {
            formData.append('identificacion', archivos.identificacion.files[0]);
        }

        return formData;
    }

    /**
     * Muestra mensajes de estado al usuario
     * @param {string} mensaje - Mensaje a mostrar
     * @param {string} tipo - Tipo de mensaje (success, error, info)
     */
    mostrarMensaje(mensaje, tipo = 'info') {
        // Crear elemento de mensaje si no existe
        let contenedorMensajes = document.getElementById('mensajes-organizacion');
        
        if (!contenedorMensajes) {
            contenedorMensajes = document.createElement('div');
            contenedorMensajes.id = 'mensajes-organizacion';
            contenedorMensajes.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(contenedorMensajes);
        }

        // Crear mensaje
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `alert alert-${tipo}`;
        mensajeDiv.style.cssText = `
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
            color: white;
            background-color: ${tipo === 'success' ? '#28a745' : tipo === 'error' ? '#dc3545' : '#007bff'};
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease;
        `;
        mensajeDiv.textContent = mensaje;

        contenedorMensajes.appendChild(mensajeDiv);

        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            if (mensajeDiv.parentNode) {
                mensajeDiv.remove();
            }
        }, 5000);
    }
}

// Función global para envío de solicitudes (compatible con registro-organizacion.js)
window.enviarSolicitudOrganizacion = async function(datosFormulario) {
    try {
        console.log('📤 Enviando solicitud de organización:', datosFormulario);
        
        // Preparar archivos
        const archivos = {
            actaConstitutiva: document.getElementById('actaConstitutiva'),
            identificacion: document.getElementById('identificacion')
        };

        // Validar archivos si existen
        const todosArchivos = [];
        if (archivos.actaConstitutiva && archivos.actaConstitutiva.files[0]) {
            todosArchivos.push(archivos.actaConstitutiva.files[0]);
        }
        if (archivos.identificacion && archivos.identificacion.files[0]) {
            todosArchivos.push(archivos.identificacion.files[0]);
        }

        if (todosArchivos.length > 0 && !organizacionesAPI.validarArchivos(todosArchivos)) {
            throw new Error('Los archivos no son válidos');
        }

        // Preparar FormData
        const formData = organizacionesAPI.prepararFormData(datosFormulario, archivos);
        
        // Intentar enviar solicitud al servidor
        try {
            console.log('🌐 Intentando conectar con el servidor...');
            const resultado = await organizacionesAPI.registrarOrganizacion(formData);
            
            // Disparar evento para notificar al panel de administración
            const evento = new CustomEvent('solicitudEnviada', {
                detail: {
                    solicitud: datosFormulario,
                    timestamp: new Date().toISOString(),
                    servidor: true
                }
            });
            window.dispatchEvent(evento);
            console.log('📡 Evento solicitudEnviada disparado (servidor)');
            
            return {
                success: true,
                data: {
                    numeroSolicitud: 'ORG-' + Date.now().toString().slice(-6),
                    mensaje: 'Solicitud enviada exitosamente',
                    ...resultado
                }
            };
            
        } catch (serverError) {
            console.warn('⚠️ Error de servidor, activando modo de prueba local:', serverError.message);
            
            // Modo de prueba local - simular envío exitoso y guardar solicitud
            return new Promise((resolve) => {
                setTimeout(() => {
                    const numeroSolicitud = 'ORG-' + Date.now().toString().slice(-6);
                    const fechaActual = new Date().toISOString();
                    
                    // Crear objeto de solicitud completo
                    const solicitud = {
                        id: numeroSolicitud,
                        numeroSolicitud: numeroSolicitud,
                        fechaSolicitud: fechaActual,
                        fechaActualizacion: fechaActual,
                        estado: 'pendiente',
                        
                        // Datos de la organización
                        nombreOrganizacion: datosFormulario.nombreOrganizacion,
                        tipoOrganizacion: datosFormulario.tipoOrganizacion,
                        descripcion: datosFormulario.descripcion,
                        añoFundacion: datosFormulario.añoFundacion,
                        numeroMascotas: datosFormulario.numeroMascotas,
                        
                        // Datos de contacto
                        personaContacto: datosFormulario.personaContacto,
                        cargoContacto: datosFormulario.cargoContacto,
                        emailContacto: datosFormulario.emailContacto,
                        telefonoContacto: datosFormulario.telefonoContacto,
                        direccion: datosFormulario.direccion,
                        sitioWeb: datosFormulario.sitioWeb,
                        redesSociales: datosFormulario.redesSociales,
                        
                        // Datos adicionales
                        registroOficial: datosFormulario.registroOficial,
                        aceptarTerminos: datosFormulario.aceptarTerminos,
                        aceptarPoliticas: datosFormulario.aceptarPoliticas,
                        aceptarComunicaciones: datosFormulario.aceptarComunicaciones,
                        
                        // Archivos (nombres)
                        archivos: {
                            actaConstitutiva: archivos.actaConstitutiva?.files[0]?.name || null,
                            identificacion: archivos.identificacion?.files[0]?.name || null
                        },
                        
                        // Metadatos
                        origen: 'formulario_web',
                        modoLocal: true
                    };
                    
                    // Guardar en localStorage para el panel de administración
                    const solicitudesExistentes = JSON.parse(localStorage.getItem('pethouse_solicitudes_organizaciones') || '[]');
                    solicitudesExistentes.push(solicitud);
                    localStorage.setItem('pethouse_solicitudes_organizaciones', JSON.stringify(solicitudesExistentes));
                    
                    console.log('✅ Solicitud guardada localmente para administración:', solicitud);
                    
                    // Disparar evento para notificar al panel de administración
                    const evento = new CustomEvent('solicitudEnviada', {
                        detail: {
                            solicitud: solicitud,
                            timestamp: new Date().toISOString(),
                            totalSolicitudes: solicitudesExistentes.length
                        }
                    });
                    window.dispatchEvent(evento);
                    console.log('📡 Evento solicitudEnviada disparado');
                    
                    resolve({
                        success: true,
                        data: {
                            numeroSolicitud: numeroSolicitud,
                            mensaje: 'Solicitud procesada en modo de prueba local',
                            estado: 'pendiente',
                            tiempoEstimado: '2-3 días hábiles',
                            modoLocal: true,
                            datosRecibidos: {
                                nombreOrganizacion: datosFormulario.nombreOrganizacion,
                                emailContacto: datosFormulario.emailContacto,
                                personaContacto: datosFormulario.personaContacto
                            }
                        }
                    });
                }, 1500); // Simular delay de red
            });
        }
        
    } catch (error) {
        console.error('❌ Error al enviar solicitud:', error);
        
        return {
            success: false,
            error: error.message || 'Error al enviar la solicitud',
            code: 'ENVIO_ERROR'
        };
    }
};

// Función global para obtener solicitudes desde el panel de administración
window.obtenerSolicitudesAdmin = async function(filtros = {}) {
    try {
        console.log('📋 Cargando solicitudes para administración...');
        
        // Intentar obtener desde servidor
        try {
            const params = new URLSearchParams();
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.page) params.append('page', filtros.page);
            if (filtros.limit) params.append('limit', filtros.limit);
            
            const response = await fetch(`/api/admin/solicitudes-organizaciones?${params}`);
            
            if (response.ok) {
                const data = await response.json();
                return {
                    success: true,
                    data: data.solicitudes || [],
                    estadisticas: data.estadisticas || {},
                    pagination: data.pagination || {}
                };
            }
        } catch (serverError) {
            console.warn('⚠️ Error del servidor, usando datos locales:', serverError.message);
        }
        
        // Fallback a localStorage
        const solicitudesLocales = JSON.parse(localStorage.getItem('pethouse_solicitudes_organizaciones') || '[]');
        
        // Aplicar filtros localmente
        let solicitudesFiltradas = solicitudesLocales;
        if (filtros.estado && filtros.estado !== 'todas') {
            solicitudesFiltradas = solicitudesLocales.filter(s => s.estado === filtros.estado);
        }
        
        // Calcular estadísticas locales
        const estadisticas = {
            total: solicitudesLocales.length,
            pendientes: solicitudesLocales.filter(s => s.estado === 'pendiente').length,
            aprobadas: solicitudesLocales.filter(s => s.estado === 'aprobada').length,
            rechazadas: solicitudesLocales.filter(s => s.estado === 'rechazada').length,
            revision: solicitudesLocales.filter(s => s.estado === 'revision').length
        };
        
        console.log('✅ Solicitudes cargadas localmente:', solicitudesFiltradas.length);
        
        return {
            success: true,
            data: solicitudesFiltradas,
            estadisticas: estadisticas,
            pagination: {
                current: 1,
                total: 1,
                count: solicitudesFiltradas.length
            }
        };
        
    } catch (error) {
        console.error('❌ Error al obtener solicitudes:', error);
        return {
            success: false,
            error: error.message,
            data: [],
            estadisticas: {}
        };
    }
};

// Función para cambiar estado de solicitud
window.cambiarEstadoSolicitud = async function(id, nuevoEstado, notas = '') {
    try {
        console.log(`🔄 Cambiando estado de solicitud ${id} a ${nuevoEstado}`);
        
        // Intentar enviar al servidor
        try {
            const response = await fetch(`/api/admin/solicitudes-organizaciones/${id}/${nuevoEstado}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notas })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Estado cambiado en servidor');
                return {
                    success: true,
                    data: data
                };
            }
        } catch (serverError) {
            console.warn('⚠️ Error del servidor, aplicando cambio localmente:', serverError.message);
        }
        
        // Fallback a cambio local
        const solicitudes = JSON.parse(localStorage.getItem('pethouse_solicitudes_organizaciones') || '[]');
        const solicitudIndex = solicitudes.findIndex(s => s.id === id);
        
        if (solicitudIndex === -1) {
            throw new Error('Solicitud no encontrada');
        }
        
        // Actualizar solicitud
        solicitudes[solicitudIndex].estado = nuevoEstado;
        solicitudes[solicitudIndex].fechaActualizacion = new Date().toISOString();
        solicitudes[solicitudIndex].notas = notas;
        
        // Guardar cambios
        localStorage.setItem('pethouse_solicitudes_organizaciones', JSON.stringify(solicitudes));
        
        // Si se aprueba, agregar a organizaciones activas
        if (nuevoEstado === 'aprobada') {
            await crearOrganizacionAprobada(solicitudes[solicitudIndex]);
        }
        
        console.log('✅ Estado cambiado localmente');
        
        return {
            success: true,
            data: {
                id: id,
                nuevoEstado: nuevoEstado,
                notas: notas
            }
        };
        
    } catch (error) {
        console.error('❌ Error al cambiar estado:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Función auxiliar para crear organización aprobada
async function crearOrganizacionAprobada(solicitud) {
    try {
        const organizacionesActivas = JSON.parse(localStorage.getItem('pethouse_organizaciones_activas') || '[]');
        
        const nuevaOrganizacion = {
            id: `ORG-ACTIVE-${Date.now()}`,
            nombre: solicitud.nombreOrganizacion,
            tipo: solicitud.tipoOrganizacion,
            descripcion: solicitud.descripcion,
            contacto: {
                persona: solicitud.personaContacto,
                cargo: solicitud.cargoContacto,
                email: solicitud.emailContacto,
                telefono: solicitud.telefonoContacto
            },
            ubicacion: {
                direccion: solicitud.direccion,
                ciudad: '',
                estado: ''
            },
            fechaRegistro: solicitud.fechaSolicitud,
            fechaAprobacion: new Date().toISOString(),
            estado: 'activa',
            verificada: true,
            solicitudOriginal: solicitud.id,
            estadisticas: {
                adopciones: 0,
                mascotas: solicitud.numeroMascotas || 0
            }
        };
        
        organizacionesActivas.push(nuevaOrganizacion);
        localStorage.setItem('pethouse_organizaciones_activas', JSON.stringify(organizacionesActivas));
        
        console.log('✅ Organización creada como activa:', nuevaOrganizacion);
        
    } catch (error) {
        console.error('❌ Error al crear organización aprobada:', error);
    }
}

// Crear instancia global
const organizacionesAPI = new OrganizacionesAPI();

// CSS para animaciones
if (!document.getElementById('organizaciones-api-styles')) {
    const styles = document.createElement('style');
    styles.id = 'organizaciones-api-styles';
    styles.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .alert {
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
        }
    `;
    document.head.appendChild(styles);
}

// ========================================
//   FUNCIONES GLOBALES PARA ADMIN
// ========================================

/**
 * Función global para aprobar una solicitud
 * @param {string} solicitudId - ID de la solicitud a aprobar
 * @param {string} comentarios - Comentarios del administrador (opcional)
 * @returns {Promise<Object>} Resultado de la operación
 */
window.aprobarSolicitud = async function(solicitudId, comentarios = '') {
    try {
        console.log('Aprobando solicitud:', solicitudId);
        
        // Intentar envío al servidor
        try {
            const response = await fetch('/api/admin/solicitudes/aprobar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    solicitudId,
                    comentarios,
                    fechaAprobacion: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                const resultado = await response.json();
                console.log('Solicitud aprobada en servidor:', resultado);
                
                // Actualizar localStorage también
                actualizarEstadoEnLocalStorage(solicitudId, 'aprobada', comentarios);
                
                // Disparar evento de actualización
                document.dispatchEvent(new CustomEvent('solicitudAprobada', {
                    detail: { solicitudId, estado: 'aprobada', comentarios }
                }));
                
                return {
                    success: true,
                    message: 'Solicitud aprobada correctamente',
                    data: resultado
                };
            }
        } catch (error) {
            console.log('Error en servidor, usando fallback a localStorage:', error.message);
        }
        
        // Fallback a localStorage
        const resultado = actualizarEstadoEnLocalStorage(solicitudId, 'aprobada', comentarios);
        
        if (resultado) {
            // Disparar evento de actualización
            document.dispatchEvent(new CustomEvent('solicitudAprobada', {
                detail: { solicitudId, estado: 'aprobada', comentarios }
            }));
            
            return {
                success: true,
                message: 'Solicitud aprobada correctamente (localStorage)',
                data: resultado
            };
        } else {
            throw new Error('No se pudo encontrar la solicitud');
        }
        
    } catch (error) {
        console.error('Error al aprobar solicitud:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Función global para rechazar una solicitud
 * @param {string} solicitudId - ID de la solicitud a rechazar
 * @param {string} motivo - Motivo del rechazo
 * @returns {Promise<Object>} Resultado de la operación
 */
window.rechazarSolicitud = async function(solicitudId, motivo = '') {
    try {
        console.log('Rechazando solicitud:', solicitudId);
        
        // Intentar envío al servidor
        try {
            const response = await fetch('/api/admin/solicitudes/rechazar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    solicitudId,
                    motivo,
                    fechaRechazo: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                const resultado = await response.json();
                console.log('Solicitud rechazada en servidor:', resultado);
                
                // Actualizar localStorage también
                actualizarEstadoEnLocalStorage(solicitudId, 'rechazada', motivo);
                
                // Disparar evento de actualización
                document.dispatchEvent(new CustomEvent('solicitudRechazada', {
                    detail: { solicitudId, estado: 'rechazada', motivo }
                }));
                
                return {
                    success: true,
                    message: 'Solicitud rechazada correctamente',
                    data: resultado
                };
            }
        } catch (error) {
            console.log('Error en servidor, usando fallback a localStorage:', error.message);
        }
        
        // Fallback a localStorage
        const resultado = actualizarEstadoEnLocalStorage(solicitudId, 'rechazada', motivo);
        
        if (resultado) {
            // Disparar evento de actualización
            document.dispatchEvent(new CustomEvent('solicitudRechazada', {
                detail: { solicitudId, estado: 'rechazada', motivo }
            }));
            
            return {
                success: true,
                message: 'Solicitud rechazada correctamente (localStorage)',
                data: resultado
            };
        } else {
            throw new Error('No se pudo encontrar la solicitud');
        }
        
    } catch (error) {
        console.error('Error al rechazar solicitud:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Función auxiliar para actualizar el estado en localStorage
 * @param {string} solicitudId - ID de la solicitud
 * @param {string} nuevoEstado - Nuevo estado (aprobada/rechazada)
 * @param {string} comentarios - Comentarios o motivo
 * @returns {Object|null} Solicitud actualizada o null si no se encuentra
 */
function actualizarEstadoEnLocalStorage(solicitudId, nuevoEstado, comentarios) {
    try {
        const solicitudes = JSON.parse(localStorage.getItem('solicitudesOrganizaciones') || '[]');
        const indice = solicitudes.findIndex(s => s.id === solicitudId);
        
        if (indice !== -1) {
            solicitudes[indice].estado = nuevoEstado;
            solicitudes[indice].fechaActualizacion = new Date().toISOString();
            
            if (nuevoEstado === 'aprobada') {
                solicitudes[indice].fechaAprobacion = new Date().toISOString();
                solicitudes[indice].comentariosAprobacion = comentarios;
            } else if (nuevoEstado === 'rechazada') {
                solicitudes[indice].fechaRechazo = new Date().toISOString();
                solicitudes[indice].motivoRechazo = comentarios;
            }
            
            localStorage.setItem('solicitudesOrganizaciones', JSON.stringify(solicitudes));
            
            // Disparar evento de storage para sincronización
            window.dispatchEvent(new Event('storage'));
            
            return solicitudes[indice];
        }
        
        return null;
    } catch (error) {
        console.error('Error al actualizar localStorage:', error);
        return null;
    }
}