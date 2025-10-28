// ========================================
//   LOGIN MODERNO - FUNCIONALIDAD AVANZADA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initLoginModerno();
});

function initLoginModerno() {
    console.log('🔐 Inicializando Login Moderno...');
    
    // Inicializar funcionalidades
    initFormSubmission();
    initDemoButtons();
    initPasswordToggle();
    initForgotPassword();
    initFormValidation();
    initRememberMe();
    
    console.log('✅ Login Moderno inicializado correctamente');
}

// ENVÍO DEL FORMULARIO
function initFormSubmission() {
    const form = document.getElementById('form-login');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password'),
            recordar: formData.get('recordar')
        };
        
        procesarLogin(credentials);
    });
}

// PROCESAMIENTO DEL LOGIN
function procesarLogin(credentials) {
    const btnLogin = document.querySelector('.btn-login');
    const btnText = btnLogin.querySelector('.btn-text');
    const btnIcon = btnLogin.querySelector('.btn-icon');
    
    // Mostrar loading
    btnLogin.disabled = true;
    btnText.textContent = 'Iniciando sesión...';
    btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
    
    // Simular autenticación (en producción sería una llamada al servidor)
    setTimeout(() => {
        const resultado = autenticarUsuario(credentials.email, credentials.password);
        
        if (resultado.success) {
            // Login exitoso
            btnText.textContent = '¡Éxito!';
            btnIcon.className = 'fas fa-check btn-icon';
            btnLogin.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Guardar sesión
            guardarSesion(resultado.usuario, credentials.recordar);
            
            // Mostrar mensaje de éxito
            mostrarExito('¡Bienvenido!', `Hola ${resultado.usuario.nombre}, has iniciado sesión correctamente.`);
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                const redirectUrl = getRedirectUrl(resultado.usuario);
                window.location.href = redirectUrl;
            }, 2000);
            
        } else {
            // Login fallido
            btnLogin.disabled = false;
            btnText.textContent = 'Iniciar Sesión';
            btnIcon.className = 'fas fa-arrow-right btn-icon';
            
            mostrarError('Credenciales incorrectas', resultado.mensaje);
            
            // Shake animation
            btnLogin.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                btnLogin.style.animation = '';
            }, 500);
        }
    }, 1500);
}

// AUTENTICACIÓN DE USUARIO
function autenticarUsuario(email, password) {
    console.log('🔍 Autenticando usuario:', email);
    
    // Base de datos simulada (en producción vendría del servidor)
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios_pethouse') || '[]');
    
    // Obtener usuarios organizaciones
    const usuariosOrganizaciones = JSON.parse(localStorage.getItem('usuariosOrganizaciones') || '[]');
    
    // Usuarios predefinidos del sistema
    const usuariosSistema = [
        {
            id: 'admin',
            email: 'admin@pethouse.com',
            password: 'PetHouse2025!',
            nombre: 'Administrador',
            apellido: 'PETHOUSE',
            role: 'admin',
            avatar: '../assets/images/LOGO.jpg'
        },
        {
            id: 'demo',
            email: 'demo@pethouse.com',
            password: 'Demo123',
            nombre: 'Usuario',
            apellido: 'Demo',
            role: 'user',
            avatar: '../assets/images/LOGO.jpg'
        },
        {
            id: 'lg',
            email: 'lg341154@gmail.com',
            password: '12345',
            nombre: 'Leo',
            apellido: 'González',
            role: 'admin',
            avatar: '../assets/images/LOGO.jpg'
        }
    ];
    
    // 1. Buscar en usuarios del sistema
    let usuario = usuariosSistema.find(u => u.email === email && u.password === password);
    
    // 2. Si no se encuentra, buscar en usuarios organizaciones
    if (!usuario) {
        const usuarioOrg = usuariosOrganizaciones.find(u => u.email === email && u.contraseña === password);
        if (usuarioOrg) {
            usuario = {
                id: usuarioOrg.id,
                email: usuarioOrg.email,
                nombre: usuarioOrg.organizacion.nombreOrganizacion,
                apellido: '', // Las organizaciones no tienen apellido
                role: 'organizacion',
                tipo: 'organizacion',
                organizacion: usuarioOrg.organizacion,
                permisos: usuarioOrg.permisos || ['dashboard', 'mascotas', 'adopciones'],
                requiereCambioContraseña: usuarioOrg.requiereCambioContraseña || false,
                avatar: '../assets/images/LOGO.jpg'
            };
        }
    }
    
    // 3. Si aún no se encuentra, buscar en usuarios registrados normales
    if (!usuario) {
        usuario = usuariosRegistrados.find(u => u.email === email && u.password === password);
        if (usuario) {
            usuario.role = usuario.role || 'user';
        }
    }
    
    if (usuario) {
        // Actualizar último login
        usuario.ultimoLogin = new Date().toISOString();
        
        // Si es organización y requiere cambio de contraseña, marcarlo
        if (usuario.tipo === 'organizacion' && usuario.requiereCambioContraseña) {
            console.log('⚠️ Usuario organizacional requiere cambio de contraseña');
        }
        
        return {
            success: true,
            usuario: usuario,
            mensaje: usuario.tipo === 'organizacion' ? 
                `Bienvenido ${usuario.nombre}` : 
                'Login exitoso'
        };
    } else {
        return {
            success: false,
            mensaje: 'Email o contraseña incorrectos. Verifica tus credenciales e intenta nuevamente.'
        };
    }
}

// GUARDAR SESIÓN
function guardarSesion(usuario, recordar) {
    const sesion = {
        usuario: usuario,
        fechaLogin: new Date().toISOString(),
        recordar: recordar
    };
    
    if (recordar) {
        localStorage.setItem('sesion_pethouse', JSON.stringify(sesion));
        // Sincronizar con sistema de adopciones
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', usuario.nombre);
        localStorage.setItem('userEmail', usuario.email);
        localStorage.setItem('userRole', usuario.role);
    } else {
        sessionStorage.setItem('sesion_pethouse', JSON.stringify(sesion));
        // Sincronizar con sistema de adopciones
        sessionStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('userName', usuario.nombre);
        sessionStorage.setItem('userEmail', usuario.email);
        sessionStorage.setItem('userRole', usuario.role);
    }
    
    console.log('💾 Sesión guardada para:', usuario.nombre);
    console.log('🔑 Sistema de adopciones sincronizado');
}

// OBTENER URL DE REDIRECCIÓN
function getRedirectUrl(usuario) {
    // Verificar si hay una URL de retorno en el query string
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return');
    
    if (returnUrl) {
        return returnUrl;
    }
    
    // Verificar si hay adopción pendiente
    const pendingAdoption = localStorage.getItem('pendingAdoption');
    if (pendingAdoption) {
        return 'adopciones.html';
    }
    
    // Si es organización y requiere cambio de contraseña, ir a configuración
    if (usuario.tipo === 'organizacion' && usuario.requiereCambioContraseña) {
        // En el futuro podrías redirigir a una página de cambio de contraseña
        console.log('⚠️ La organización debe cambiar su contraseña');
        return 'dashboard.html?cambio_password=true';
    }
    
    // Redirigir según el rol del usuario
    switch (usuario.role) {
        case 'admin':
            return 'dashboard.html';
        case 'organizacion':
            return 'dashboard.html';
        default:
            return 'adopciones.html'; // Corregido: minúscula
    }
}

// BOTONES DE DEMO
function initDemoButtons() {
    const demoBtns = document.querySelectorAll('.demo-btn');
    
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const email = this.dataset.email;
            const password = this.dataset.password;
            
            // Llenar campos automáticamente
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            
            // Animar inputs
            animateInput(document.getElementById('email'));
            animateInput(document.getElementById('password'));
            
            // Mostrar feedback
            this.style.background = '#e5e7eb';
            this.innerHTML = '<i class="fas fa-check"></i> Cargado';
            
            setTimeout(() => {
                this.style.background = '';
                this.innerHTML = this.dataset.email.includes('admin') ? 
                    '<i class="fas fa-crown"></i> Admin Demo' : 
                    '<i class="fas fa-user"></i> Usuario Demo';
            }, 1000);
        });
    });
}

// TOGGLE CONTRASEÑA
function initPasswordToggle() {
    const toggleBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (!toggleBtn || !passwordInput) return;
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const icon = this.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        // Pequeña animación
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
}

// RECUPERAR CONTRASEÑA
function initForgotPassword() {
    const forgotLink = document.getElementById('forgot-password');
    
    if (!forgotLink) return;
    
    forgotLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        if (email) {
            mostrarModalRecuperacion(email);
        } else {
            mostrarError('Email requerido', 'Por favor ingresa tu email antes de solicitar recuperación de contraseña.');
            document.getElementById('email').focus();
        }
    });
}

// MODAL DE RECUPERACIÓN
function mostrarModalRecuperacion(email) {
    const modal = document.createElement('div');
    modal.className = 'modal modal-active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🔑 Recuperar Contraseña</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem; color: #6b7280;">
                    Te enviaremos un enlace de recuperación a tu email.
                </p>
                <div class="form-group">
                    <label for="recovery-email">Email de recuperación:</label>
                    <input type="email" id="recovery-email" value="${email}" class="form-input" style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem;">
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn-recovery" style="flex: 1; padding: 0.75rem; background: #667eea; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                        Enviar Enlace
                    </button>
                    <button class="btn-cancel" style="flex: 1; padding: 0.75rem; background: #f3f4f6; color: #4b5563; border: none; border-radius: 0.5rem; cursor: pointer;">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-cancel').addEventListener('click', () => modal.remove());
    
    modal.querySelector('.btn-recovery').addEventListener('click', function() {
        const recoveryEmail = modal.querySelector('#recovery-email').value;
        
        if (recoveryEmail) {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            this.disabled = true;
            
            setTimeout(() => {
                mostrarExito('¡Enlace enviado!', `Se ha enviado un enlace de recuperación a ${recoveryEmail}`);
                modal.remove();
            }, 2000);
        }
    });
    
    // Focus en el input
    setTimeout(() => {
        modal.querySelector('#recovery-email').focus();
    }, 100);
}

// VALIDACIÓN DEL FORMULARIO
function initFormValidation() {
    const inputs = document.querySelectorAll('#form-login input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        input.addEventListener('input', function() {
            // Remover error cuando el usuario empiece a escribir
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
}

function validarCampo(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                errorMessage = 'El email es requerido';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
            break;
            
        case 'password':
            if (!value) {
                isValid = false;
                errorMessage = 'La contraseña es requerida';
            } else if (value.length < 3) {
                isValid = false;
                errorMessage = 'La contraseña debe tener al menos 3 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        mostrarErrorCampo(input, errorMessage);
    }
    
    return isValid;
}

function mostrarErrorCampo(input, mensaje) {
    input.classList.add('error');
    
    // Remover mensaje de error anterior
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'color: #dc2626; font-size: 0.75rem; margin-top: 0.25rem;';
    errorDiv.textContent = mensaje;
    
    input.parentNode.appendChild(errorDiv);
}

// RECORDAR USUARIO
function initRememberMe() {
    // Verificar si hay una sesión guardada
    const sesionGuardada = localStorage.getItem('sesion_pethouse');
    
    if (sesionGuardada) {
        try {
            const sesion = JSON.parse(sesionGuardada);
            const fechaSesion = new Date(sesion.fechaLogin);
            const ahora = new Date();
            const diasTranscurridos = (ahora - fechaSesion) / (1000 * 60 * 60 * 24);
            
            // Si la sesión es menor a 30 días, auto-completar
            if (diasTranscurridos < 30 && sesion.recordar) {
                document.getElementById('email').value = sesion.usuario.email;
                document.getElementById('recordar').checked = true;
                
                // Mostrar sugerencia
                setTimeout(() => {
                    mostrarInfo('Sesión guardada', `¡Hola ${sesion.usuario.nombre}! Tu sesión anterior está guardada.`);
                }, 1000);
            }
        } catch (e) {
            console.error('Error al recuperar sesión:', e);
        }
    }
}

// UTILIDADES DE ANIMACIÓN
function animateInput(input) {
    input.style.transform = 'scale(1.02)';
    input.style.borderColor = '#667eea';
    
    setTimeout(() => {
        input.style.transform = 'scale(1)';
        input.style.borderColor = '';
    }, 200);
}

// UTILIDADES DE MENSAJES
function mostrarInfo(titulo, mensaje) {
    const infoAlert = document.createElement('div');
    infoAlert.className = 'alert alert-info';
    infoAlert.style.cssText = 'background: #eff6ff; border: 1px solid #93c5fd; color: #1d4ed8;';
    infoAlert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-info-circle"></i>
            <div>
                <h4>${titulo}</h4>
                <p>${mensaje}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(infoAlert);
    
    setTimeout(() => {
        infoAlert.remove();
    }, 4000);
}

// CSS de animación shake
const shakeCSS = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

// Agregar CSS de animación
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeCSS;
document.head.appendChild(styleSheet);

// Agregar estilos para error en inputs
const errorInputCSS = `
    .form-group input.error {
        border-color: #dc2626 !important;
        background: #fef2f2 !important;
    }
    
    .form-group input.error:focus {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
    }
`;

const errorStyleSheet = document.createElement('style');
errorStyleSheet.textContent = errorInputCSS;
document.head.appendChild(errorStyleSheet);

console.log('🔐 Login Moderno cargado completamente');