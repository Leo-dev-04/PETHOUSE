// ========================================
//   FORMULARIOS-FUNCIONAL.JS - SISTEMA COMPLETO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initFormulariosSistema();
});

function initFormulariosSistema() {
    // Inicializar formulario de registro
    initFormularioRegistro();
    
    // Inicializar formulario de contacto
    initFormularioContacto();
    
    // Inicializar formulario de adopción
    initFormularioAdopcion();
    
    console.log('📋 Sistema de formularios funcional inicializado');
}

// FORMULARIO DE REGISTRO
function initFormularioRegistro() {
    const formRegistro = document.getElementById('form-registro') || document.querySelector('.form-registro');
    if (!formRegistro) return;
    
    formRegistro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(formRegistro);
        const datos = {
            nombre: formData.get('nombre'),
            apellido: formData.get('apellido'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirm-password'),
            terminos: formData.get('terminos')
        };
        
        // Validar datos
        if (validarRegistro(datos)) {
            procesarRegistro(datos);
        }
    });
}

function validarRegistro(datos) {
    const errores = [];
    
    // Validar nombre
    if (!datos.nombre || datos.nombre.length < 2) {
        errores.push('El nombre debe tener al menos 2 caracteres');
    }
    
    // Validar apellido
    if (!datos.apellido || datos.apellido.length < 2) {
        errores.push('El apellido debe tener al menos 2 caracteres');
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
        errores.push('Por favor ingresa un email válido');
    }
    
    // Validar teléfono
    const telefonoRegex = /^(\+52|52)?[\s-]?(\d{3})[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})$/;
    if (!telefonoRegex.test(datos.telefono)) {
        errores.push('Por favor ingresa un teléfono válido (formato mexicano)');
    }
    
    // Validar contraseña
    if (!datos.password || datos.password.length < 8) {
        errores.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    // Validar confirmación de contraseña
    if (datos.password !== datos.confirmPassword) {
        errores.push('Las contraseñas no coinciden');
    }
    
    // Validar términos
    if (!datos.terminos) {
        errores.push('Debes aceptar los términos y condiciones');
    }
    
    if (errores.length > 0) {
        mostrarErrores(errores);
        return false;
    }
    
    return true;
}

function procesarRegistro(datos) {
    // Mostrar loading
    mostrarLoading('Creando tu cuenta...');
    
    // Simular proceso de registro
    setTimeout(() => {
        // Guardar en localStorage (simulando base de datos)
        const usuarios = JSON.parse(localStorage.getItem('usuarios_pethouse') || '[]');
        
        // Verificar si el email ya existe
        if (usuarios.find(user => user.email === datos.email)) {
            mostrarError('Este email ya está registrado');
            return;
        }
        
        // Crear nuevo usuario
        const nuevoUsuario = {
            id: Date.now(),
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            telefono: datos.telefono,
            password: datos.password, // En producción esto estaría hasheado
            fechaRegistro: new Date().toISOString(),
            activo: true
        };
        
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios_pethouse', JSON.stringify(usuarios));
        
        // Mostrar éxito
        mostrarExito('¡Cuenta creada exitosamente!', 'Ahora puedes iniciar sesión con tu nuevo cuenta.');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    }, 1500);
}

// FORMULARIO DE CONTACTO
function initFormularioContacto() {
    const formContacto = document.getElementById('form-contacto') || document.querySelector('.form-contacto');
    if (!formContacto) return;
    
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(formContacto);
        const datos = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            asunto: formData.get('asunto'),
            mensaje: formData.get('mensaje')
        };
        
        if (validarContacto(datos)) {
            procesarContacto(datos);
        }
    });
}

function validarContacto(datos) {
    const errores = [];
    
    if (!datos.nombre || datos.nombre.length < 2) {
        errores.push('El nombre debe tener al menos 2 caracteres');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
        errores.push('Por favor ingresa un email válido');
    }
    
    if (!datos.asunto || datos.asunto.length < 5) {
        errores.push('El asunto debe tener al menos 5 caracteres');
    }
    
    if (!datos.mensaje || datos.mensaje.length < 10) {
        errores.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    if (errores.length > 0) {
        mostrarErrores(errores);
        return false;
    }
    
    return true;
}

function procesarContacto(datos) {
    mostrarLoading('Enviando mensaje...');
    
    setTimeout(() => {
        // Guardar mensaje en localStorage
        const mensajes = JSON.parse(localStorage.getItem('mensajes_pethouse') || '[]');
        
        const nuevoMensaje = {
            id: Date.now(),
            ...datos,
            fecha: new Date().toISOString(),
            estado: 'pendiente'
        };
        
        mensajes.push(nuevoMensaje);
        localStorage.setItem('mensajes_pethouse', JSON.stringify(mensajes));
        
        mostrarExito('¡Mensaje enviado!', 'Te contactaremos pronto. Gracias por tu interés.');
        
        // Limpiar formulario
        document.querySelector('.form-contacto').reset();
        
    }, 1000);
}

// FORMULARIO DE ADOPCIÓN
function initFormularioAdopcion() {
    const formsAdopcion = document.querySelectorAll('.form-adopcion, .form-solicitud-adopcion');
    
    formsAdopcion.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const datos = {
                mascota: formData.get('mascota') || form.dataset.mascota,
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                experiencia: formData.get('experiencia'),
                vivienda: formData.get('vivienda'),
                motivacion: formData.get('motivacion')
            };
            
            if (validarAdopcion(datos)) {
                procesarAdopcion(datos);
            }
        });
    });
}

function validarAdopcion(datos) {
    const errores = [];
    
    if (!datos.nombre || datos.nombre.length < 2) {
        errores.push('El nombre debe tener al menos 2 caracteres');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
        errores.push('Por favor ingresa un email válido');
    }
    
    if (!datos.telefono) {
        errores.push('El teléfono es requerido');
    }
    
    if (!datos.vivienda) {
        errores.push('Debes especificar tu tipo de vivienda');
    }
    
    if (!datos.motivacion || datos.motivacion.length < 20) {
        errores.push('Por favor explica tu motivación (mínimo 20 caracteres)');
    }
    
    if (errores.length > 0) {
        mostrarErrores(errores);
        return false;
    }
    
    return true;
}

function procesarAdopcion(datos) {
    mostrarLoading('Procesando solicitud de adopción...');
    
    setTimeout(() => {
        // Guardar solicitud en localStorage
        const solicitudes = JSON.parse(localStorage.getItem('solicitudes_adopcion') || '[]');
        
        const nuevaSolicitud = {
            id: Date.now(),
            ...datos,
            fecha: new Date().toISOString(),
            estado: 'pendiente_revision'
        };
        
        solicitudes.push(nuevaSolicitud);
        localStorage.setItem('solicitudes_adopcion', JSON.stringify(solicitudes));
        
        mostrarExito(
            '¡Solicitud enviada!', 
            `Tu solicitud para adoptar a ${datos.mascota || 'la mascota'} ha sido recibida. Nos pondremos en contacto contigo dentro de 24-48 horas para coordinar la visita.`
        );
        
        // Mostrar siguiente paso
        setTimeout(() => {
            mostrarProximosPasos();
        }, 3000);
        
    }, 1500);
}

// UTILIDADES DE UI
function mostrarErrores(errores) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-error';
    errorContainer.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <h4>Por favor corrige los siguientes errores:</h4>
                <ul>
                    ${errores.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    mostrarAlerta(errorContainer);
}

function mostrarError(mensaje) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-error';
    errorAlert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-times-circle"></i>
            <div>
                <h4>Error</h4>
                <p>${mensaje}</p>
            </div>
        </div>
    `;
    
    mostrarAlerta(errorAlert);
}

function mostrarExito(titulo, mensaje) {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success';
    successAlert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>${titulo}</h4>
                <p>${mensaje}</p>
            </div>
        </div>
    `;
    
    mostrarAlerta(successAlert);
}

function mostrarLoading(mensaje) {
    const loadingAlert = document.createElement('div');
    loadingAlert.className = 'alert alert-loading';
    loadingAlert.innerHTML = `
        <div class="alert-content">
            <div class="spinner"></div>
            <div>
                <h4>${mensaje}</h4>
                <p>Por favor espera...</p>
            </div>
        </div>
    `;
    
    mostrarAlerta(loadingAlert);
}

function mostrarAlerta(alertElement) {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Agregar nueva alerta
    document.body.appendChild(alertElement);
    
    // Auto-remover después de 5 segundos (excepto loading)
    if (!alertElement.classList.contains('alert-loading')) {
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }
}

function mostrarProximosPasos() {
    const modal = document.createElement('div');
    modal.className = 'modal modal-active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎉 ¡Próximos pasos!</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="pasos-adopcion">
                    <div class="paso">
                        <div class="paso-numero">1</div>
                        <div class="paso-contenido">
                            <h4>Revisión de solicitud</h4>
                            <p>Nuestro equipo revisará tu solicitud (24-48 horas)</p>
                        </div>
                    </div>
                    <div class="paso">
                        <div class="paso-numero">2</div>
                        <div class="paso-contenido">
                            <h4>Entrevista inicial</h4>
                            <p>Te contactaremos para una breve entrevista telefónica</p>
                        </div>
                    </div>
                    <div class="paso">
                        <div class="paso-numero">3</div>
                        <div class="paso-contenido">
                            <h4>Visita programada</h4>
                            <p>Coordinaremos una visita para que conozcas a tu futura mascota</p>
                        </div>
                    </div>
                    <div class="paso">
                        <div class="paso-numero">4</div>
                        <div class="paso-contenido">
                            <h4>Adopción finalizada</h4>
                            <p>¡Tu nueva mascota se va a casa contigo!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });
}

// Exportar funciones
window.FormulariosFuncionales = {
    procesarRegistro,
    procesarContacto,
    procesarAdopcion,
    mostrarExito,
    mostrarError
};