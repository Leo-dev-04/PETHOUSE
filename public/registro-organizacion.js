/**
 * REGISTRO DE ORGANIZACIONES - PETHOUSE
 * Lógica de formulario multi-paso y validaciones
 */

let pasoActual = 1;
const totalPasos = 4;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupFileUploads();
    setupForm();
    setupMobileMenu();
    actualizarVista(); // Inicializar vista
    console.log('✅ Sistema de registro inicializado');
});

/**
 * Configuración del menú móvil
 */
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}

/**
 * Configuración de uploads de archivos
 */
function setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const statusElement = document.getElementById(this.id + 'Status');
            if (statusElement) {
                if (this.files.length > 0) {
                    const fileName = this.files[0].name;
                    const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2);
                    statusElement.textContent = `✅ ${fileName} (${fileSize} MB)`;
                    statusElement.style.color = '#22c55e';
                } else {
                    statusElement.textContent = 'No se ha seleccionado archivo';
                    statusElement.style.color = '#6b7280';
                }
            }
        });
    });
}

/**
 * Configuración del formulario principal
 */
function setupForm() {
    const form = document.getElementById('registroForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            enviarSolicitud();
        });
    }
}

/**
 * Avanzar al siguiente paso
 */
function siguientePaso() {
    if (validarPasoActual()) {
        if (pasoActual < totalPasos) {
            pasoActual++;
            actualizarVista();
        }
    }
}

/**
 * Retroceder al paso anterior
 */
function anteriorPaso() {
    if (pasoActual > 1) {
        pasoActual--;
        actualizarVista();
    }
}

/**
 * Actualizar la vista del formulario según el paso actual
 */
function actualizarVista() {
    // Ocultar todos los pasos
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Mostrar paso actual
    const pasoActualElement = document.getElementById('form-step-' + pasoActual);
    if (pasoActualElement) {
        pasoActualElement.classList.add('active');
    }

    // Actualizar indicadores
    document.querySelectorAll('.step-indicator').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === pasoActual) {
            step.classList.add('active');
        } else if (index + 1 < pasoActual) {
            step.classList.add('completed');
        }
    });

    // Actualizar barra de progreso
    const progress = (pasoActual / totalPasos) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressText) {
        progressText.textContent = `Paso ${pasoActual} de ${totalPasos}`;
    }

    // Actualizar botones
    actualizarBotones();

    // Scroll suave al top del formulario
    const formSection = document.querySelector('.formulario-section');
    if (formSection) {
        formSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

/**
 * Actualizar la visibilidad de los botones de navegación
 */
function actualizarBotones() {
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const btnEnviar = document.getElementById('btnEnviar');

    if (btnAnterior) {
        btnAnterior.style.display = pasoActual > 1 ? 'block' : 'none';
    }
    
    if (btnSiguiente) {
        btnSiguiente.style.display = pasoActual < totalPasos ? 'block' : 'none';
    }
    
    if (btnEnviar) {
        btnEnviar.style.display = pasoActual === totalPasos ? 'block' : 'none';
    }
}

/**
 * Validar el paso actual del formulario
 */
function validarPasoActual() {
    const pasoElement = document.getElementById('form-step-' + pasoActual);
    if (!pasoElement) return false;
    
    const camposRequeridos = pasoElement.querySelectorAll('[required]');
    
    // Validar campos requeridos
    for (let campo of camposRequeridos) {
        if (!campo.value.trim()) {
            const label = campo.closest('.form-group')?.querySelector('label')?.textContent || 'Campo requerido';
            mostrarError(`Por favor completa el campo: ${label.replace('*', '').trim()}`);
            campo.focus();
            return false;
        }
    }

    // Validaciones específicas por paso
    if (pasoActual === 1) {
        return validarPaso1();
    } else if (pasoActual === 2) {
        return validarPaso2();
    } else if (pasoActual === 4) {
        return validarPaso4();
    }

    return true;
}

/**
 * Validaciones específicas del Paso 1
 */
function validarPaso1() {
    const descripcion = document.getElementById('descripcion');
    if (descripcion && descripcion.value.length < 50) {
        mostrarError('La descripción debe tener al menos 50 caracteres');
        descripcion.focus();
        return false;
    }

    const año = document.getElementById('añoFundacion');
    if (año) {
        const añoValue = parseInt(año.value);
        const añoActual = new Date().getFullYear();
        if (añoValue < 1900 || añoValue > añoActual) {
            mostrarError(`El año de fundación debe estar entre 1900 y ${añoActual}`);
            año.focus();
            return false;
        }
    }

    return true;
}

/**
 * Validaciones específicas del Paso 2
 */
function validarPaso2() {
    const email = document.getElementById('emailContacto');
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            mostrarError('Por favor ingresa un email válido');
            email.focus();
            return false;
        }
    }

    const telefono = document.getElementById('telefonoContacto');
    if (telefono) {
        const telefonoRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!telefonoRegex.test(telefono.value.replace(/\s/g, ''))) {
            mostrarError('Por favor ingresa un teléfono válido (mínimo 10 dígitos)');
            telefono.focus();
            return false;
        }
    }

    const sitioWeb = document.getElementById('sitioWeb');
    if (sitioWeb && sitioWeb.value) {
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(sitioWeb.value)) {
            mostrarError('La URL del sitio web debe comenzar con http:// o https://');
            sitioWeb.focus();
            return false;
        }
    }

    return true;
}

/**
 * Validaciones específicas del Paso 4
 */
function validarPaso4() {
    const terminos = document.getElementById('aceptarTerminos');
    const politicas = document.getElementById('aceptarPoliticas');

    if (!terminos?.checked) {
        mostrarError('Debes aceptar los términos y condiciones');
        return false;
    }

    if (!politicas?.checked) {
        mostrarError('Debes aceptar las políticas de privacidad');
        return false;
    }

    return true;
}

/**
 * Enviar la solicitud de registro
 */
async function enviarSolicitud() {
    console.log('🚀 Iniciando envío de solicitud...');
    
    if (!validarPasoActual()) {
        console.warn('⚠️ Validación del paso actual falló');
        return;
    }

    // Mostrar estado de carga
    const btnEnviar = document.getElementById('btnEnviar');
    if (!btnEnviar) {
        console.error('❌ No se encontró el botón de enviar');
        return;
    }

    const textoOriginal = btnEnviar.innerHTML;
    btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnEnviar.disabled = true;

    try {
        // Recopilar datos del formulario
        console.log('📋 Recopilando datos del formulario...');
        const datosFormulario = recopilarDatos();
        console.log('✅ Datos recopilados:', datosFormulario);
        
        // Validar datos completos
        if (!validarDatosCompletos(datosFormulario)) {
            throw new Error('Datos incompletos en el formulario');
        }
        console.log('✅ Validación de datos completa exitosa');

        // Verificar si la función está disponible
        if (typeof window.enviarSolicitudOrganizacion !== 'function') {
            throw new Error('Función enviarSolicitudOrganizacion no está disponible. Revisa que organizaciones-api.js esté cargado.');
        }

        // Enviar usando la API
        console.log('📤 Enviando solicitud a la API...');
        const resultado = await window.enviarSolicitudOrganizacion(datosFormulario);
        console.log('📥 Respuesta recibida:', resultado);
        
        if (resultado.success) {
            // Actualizar número de solicitud en el modal
            const numeroElement = document.getElementById('numeroSolicitud');
            if (numeroElement) {
                numeroElement.textContent = resultado.data.numeroSolicitud;
            }

            // Mostrar modal de confirmación
            const modal = document.getElementById('modalConfirmacion');
            if (modal) {
                modal.classList.add('show');
            }

            // Log para debug
            console.log('✅ Solicitud enviada exitosamente:', resultado.data);

            // Enviar evento personalizado
            window.dispatchEvent(new CustomEvent('solicitudEnviada', {
                detail: { 
                    numeroSolicitud: resultado.data.numeroSolicitud, 
                    id: resultado.data.id,
                    datos: datosFormulario 
                }
            }));

        } else {
            const errorMsg = resultado.error || resultado.message || 'Error desconocido al enviar la solicitud';
            throw new Error(errorMsg);
        }

    } catch (error) {
        console.error('❌ Error al enviar solicitud:', error);
        console.error('Stack trace:', error.stack);
        
        let mensajeError = 'Error al procesar la solicitud: ' + error.message;
        
        // Agregar información específica según el tipo de error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            mensajeError += '\n\n🌐 Problema de conexión: Verifica que el servidor esté funcionando.';
        } else if (error.message.includes('organizaciones-api.js')) {
            mensajeError += '\n\n📁 Problema de archivo: El archivo de API no se cargó correctamente.';
        } else if (error.message.includes('Datos incompletos')) {
            mensajeError += '\n\n📝 Completa todos los campos requeridos antes de enviar.';
        }
        
        mostrarError(mensajeError);
    } finally {
        // Restaurar botón
        btnEnviar.innerHTML = textoOriginal;
        btnEnviar.disabled = false;
        console.log('🔄 Botón restaurado');
    }
}

/**
 * Recopilar todos los datos del formulario
 */
function recopilarDatos() {
    const obtenerValor = (id) => {
        const elemento = document.getElementById(id);
        return elemento ? elemento.value.trim() : '';
    };

    const obtenerArchivo = (id) => {
        const elemento = document.getElementById(id);
        return elemento?.files[0] ? elemento.files[0].name : null;
    };

    const obtenerCheckbox = (id) => {
        const elemento = document.getElementById(id);
        return elemento ? elemento.checked : false;
    };

    return {
        // Paso 1: Información Básica
        nombreOrganizacion: obtenerValor('nombreOrganizacion'),
        tipoOrganizacion: obtenerValor('tipoOrganizacion'),
        descripcion: obtenerValor('descripcion'),
        añoFundacion: obtenerValor('añoFundacion'),
        numeroMascotas: obtenerValor('numeroMascotas'),

        // Paso 2: Información de Contacto
        personaContacto: obtenerValor('personaContacto'),
        cargoContacto: obtenerValor('cargoContacto'),
        emailContacto: obtenerValor('emailContacto'),
        telefonoContacto: obtenerValor('telefonoContacto'),
        direccion: obtenerValor('direccion'),
        sitioWeb: obtenerValor('sitioWeb'),
        redesSociales: obtenerValor('redesSociales'),

        // Paso 3: Documentación
        registroOficial: obtenerValor('registroOficial'),
        actaConstitutiva: obtenerArchivo('actaConstitutiva'),
        identificacion: obtenerArchivo('identificacion'),

        // Paso 4: Términos
        aceptarTerminos: obtenerCheckbox('aceptarTerminos'),
        aceptarPoliticas: obtenerCheckbox('aceptarPoliticas'),
        aceptarComunicaciones: obtenerCheckbox('aceptarComunicaciones')
    };
}

/**
 * Cerrar el modal de confirmación
 */
function cerrarModal() {
    const modal = document.getElementById('modalConfirmacion');
    if (modal) {
        modal.classList.remove('show');
    }
    
    // Redirigir a página principal después de un momento
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

/**
 * Mostrar mensaje de error
 */
function mostrarError(mensaje) {
    // Remover alertas existentes
    document.querySelectorAll('.alert-error-temp').forEach(alert => alert.remove());

    // Crear nueva alerta
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-error alert-error-temp';
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef2f2;
        border-left: 5px solid #ef4444;
        color: #dc2626;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10001;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
        font-family: var(--font-primary);
        font-weight: 500;
    `;
    alerta.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i> ${mensaje}`;
    
    document.body.appendChild(alerta);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (alerta.parentNode) {
                    alerta.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Mostrar mensaje de éxito
 */
function mostrarExito(mensaje) {
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success';
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f0fdf4;
        border-left: 5px solid #22c55e;
        color: #15803d;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10001;
        max-width: 400px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
        font-family: var(--font-primary);
        font-weight: 500;
    `;
    alerta.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 8px;"></i> ${mensaje}`;
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        alerta.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alerta.remove(), 300);
    }, 3000);
}

/**
 * Guardar progreso del formulario (auto-guardado)
 */
function guardarProgreso() {
    const datos = recopilarDatos();
    const progreso = {
        pasoActual: pasoActual,
        datos: datos,
        fechaGuardado: new Date().toISOString()
    };
    
    localStorage.setItem('registro_organizacion_progreso', JSON.stringify(progreso));
    console.log('📄 Progreso guardado automáticamente');
}

/**
 * Cargar progreso guardado
 */
function cargarProgreso() {
    const progreso = localStorage.getItem('registro_organizacion_progreso');
    if (progreso) {
        try {
            const datos = JSON.parse(progreso);
            // Implementar lógica para cargar datos guardados si es necesario
            console.log('📄 Progreso encontrado:', datos);
        } catch (error) {
            console.error('Error al cargar progreso:', error);
        }
    }
}

/**
 * Agregar estilos para animaciones
 */
function agregarEstilosAnimacion() {
    if (!document.getElementById('animaciones-registro')) {
        const style = document.createElement('style');
        style.id = 'animaciones-registro';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .form-step.active {
                animation: fadeIn 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Validar que todos los datos obligatorios estén completos
 */
function validarDatosCompletos(datos) {
    const camposObligatorios = [
        'nombreOrganizacion',
        'tipoOrganizacion', 
        'descripcion',
        'añoFundacion',
        'numeroMascotas',
        'personaContacto',
        'cargoContacto',
        'emailContacto',
        'telefonoContacto',
        'direccion'
    ];

    const camposFaltantes = [];
    
    for (const campo of camposObligatorios) {
        if (!datos[campo] || datos[campo].toString().trim() === '') {
            camposFaltantes.push(campo);
        }
    }

    // Validar términos y condiciones
    if (!datos.aceptarTerminos) {
        camposFaltantes.push('aceptarTerminos');
    }

    if (!datos.aceptarPoliticas) {
        camposFaltantes.push('aceptarPoliticas');
    }

    if (camposFaltantes.length > 0) {
        console.error('Campos faltantes:', camposFaltantes);
        mostrarError(`Faltan campos obligatorios: ${camposFaltantes.join(', ')}`);
        return false;
    }

    return true;
}

// Inicializar estilos cuando se carga el script
agregarEstilosAnimacion();

// Auto-guardar progreso cada 30 segundos
setInterval(() => {
    if (pasoActual > 1) {
        guardarProgreso();
    }
}, 30000);

// Exponer funciones globales necesarias
window.siguientePaso = siguientePaso;
window.anteriorPaso = anteriorPaso;
window.cerrarModal = cerrarModal;
