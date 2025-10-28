// ========================================
//   REGISTRO MODERNO - FUNCIONALIDAD AVANZADA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initRegistroModerno();
});

function initRegistroModerno() {
    console.log('📝 Inicializando Registro Moderno...');
    
    // Inicializar funcionalidades
    initStepNavigation();
    initFormValidation();
    initPasswordStrength();
    initEmailCheck();
    initPasswordToggle();
    initPasswordMatch();
    initFormSubmission();
    
    console.log('✅ Registro Moderno inicializado correctamente');
}

// NAVEGACIÓN POR PASOS
let currentStep = 1;
const totalSteps = 3;

function initStepNavigation() {
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', nextStep);
    });
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', prevStep);
    });
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            // Ocultar todos los pasos
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            // Avanzar al siguiente paso
            currentStep++;
            // Mostrar solo el paso actual
            const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
            if (currentStepElement) {
                currentStepElement.classList.add('active');
            }
            updateProgressIndicator();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Ocultar todos los pasos
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        // Retroceder al paso anterior
        currentStep--;
        // Mostrar solo el paso actual
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        updateProgressIndicator();
    }
}

function updateStepDisplay() {
    // Ocultar todos los pasos
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    // Mostrar solo el paso actual
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    console.log(`📍 Navegando al paso ${currentStep}`);
}

function updateProgressIndicator() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
}

// VALIDACIÓN POR PASOS
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (currentStep === 2) {
        // Validaciones especiales para el paso de contraseñas
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm_password');
        
        if (!validatePasswordStrength(password.value)) {
            isValid = false;
            showFieldError(password, 'La contraseña no cumple con los requisitos mínimos');
        }
        
        if (password.value !== confirmPassword.value) {
            isValid = false;
            showFieldError(confirmPassword, 'Las contraseñas no coinciden');
        }
    }
    
    if (!isValid) {
        showError('Datos incompletos', 'Por favor completa todos los campos requeridos antes de continuar.');
    }
    
    return isValid;
}

// VALIDACIÓN DE FORMULARIO
function initFormValidation() {
    const form = document.getElementById('form-registro');
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
            
            // Validaciones específicas en tiempo real
            if (this.type === 'email') {
                checkEmailAvailability(this.value);
            }
            
            if (this.id === 'password') {
                updatePasswordStrength(this.value);
                checkPasswordMatch();
            }
            
            if (this.id === 'confirm_password') {
                checkPasswordMatch();
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Validación de campo requerido
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    }
    
    // Validaciones específicas por tipo
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
            break;
            
        case 'tel':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un teléfono válido';
            }
            break;
            
        case 'date':
            if (value) {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                
                if (age < 18) {
                    isValid = false;
                    errorMessage = 'Debes ser mayor de 18 años';
                } else if (age > 100) {
                    isValid = false;
                    errorMessage = 'Fecha de nacimiento inválida';
                }
            }
            break;
    }
    
    // Validaciones específicas por campo
    switch (field.id) {
        case 'nombre':
        case 'apellido':
            if (value && value.length < 2) {
                isValid = false;
                errorMessage = 'Debe tener al menos 2 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        showFieldSuccess(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.remove('success');
    field.classList.add('error');
    
    // Remover mensaje anterior
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = 'color: #dc2626; font-size: 0.75rem; margin-top: 0.25rem; display: flex; align-items: center; gap: 0.25rem;';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    clearFieldError(field);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.field-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// VERIFICACIÓN DE EMAIL
function initEmailCheck() {
    const emailInput = document.getElementById('email');
    let emailCheckTimeout;
    
    emailInput.addEventListener('input', function() {
        clearTimeout(emailCheckTimeout);
        const email = this.value.trim();
        
        if (email && isValidEmail(email)) {
            emailCheckTimeout = setTimeout(() => {
                checkEmailAvailability(email);
            }, 1000);
        } else {
            hideEmailCheck();
        }
    });
}

function checkEmailAvailability(email) {
    const emailCheck = document.querySelector('.email-check');
    
    if (!emailCheck) return;
    
    // Mostrar estado de verificación
    emailCheck.className = 'email-check checking';
    emailCheck.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando disponibilidad...';
    
    // Simular verificación (en producción sería una llamada al servidor)
    setTimeout(() => {
        const usuarios = JSON.parse(localStorage.getItem('usuarios_pethouse') || '[]');
        const emailExists = usuarios.some(user => user.email === email);
        
        // Emails predefinidos del sistema
        const systemEmails = ['admin@pethouse.com', 'demo@pethouse.com', 'lg341154@gmail.com'];
        const isSystemEmail = systemEmails.includes(email);
        
        if (emailExists || isSystemEmail) {
            emailCheck.className = 'email-check taken';
            emailCheck.innerHTML = '<i class="fas fa-times-circle"></i> Este email ya está registrado';
            showFieldError(document.getElementById('email'), 'Este email ya está en uso');
        } else {
            emailCheck.className = 'email-check available';
            emailCheck.innerHTML = '<i class="fas fa-check-circle"></i> Email disponible';
            showFieldSuccess(document.getElementById('email'));
        }
    }, 1500);
}

function hideEmailCheck() {
    const emailCheck = document.querySelector('.email-check');
    if (emailCheck) {
        emailCheck.className = 'email-check';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// FORTALEZA DE CONTRASEÑA
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
}

function updatePasswordStrength(password) {
    const currentStepElement = document.querySelector('.form-step.active');
    const strengthFill = currentStepElement ? currentStepElement.querySelector('.strength-fill') : null;
    const strengthText = currentStepElement ? currentStepElement.querySelector('.strength-text') : null;
    const requirements = currentStepElement ? currentStepElement.querySelectorAll('.requirement') : [];

    if (!strengthFill || !strengthText) return;

    const strength = calculatePasswordStrength(password);

    // Actualizar barra de fortaleza
    strengthFill.className = 'strength-fill';

    switch (strength.level) {
        case 0:
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Contraseña débil';
            break;
        case 1:
            strengthFill.classList.add('fair');
            strengthText.textContent = 'Contraseña regular';
            break;
        case 2:
            strengthFill.classList.add('good');
            strengthText.textContent = 'Contraseña buena';
            break;
        case 3:
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Contraseña fuerte';
            break;
    }

    // Actualizar requisitos
    updatePasswordRequirements(password);
}

function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => {
        if (check) score++;
    });
    
    let level = 0;
    if (score >= 3) level = 1;
    if (score >= 4) level = 2;
    if (score === 5) level = 3;
    
    return { level, score, checks };
}

function updatePasswordRequirements(password) {
    const currentStepElement = document.querySelector('.form-step.active');
    const requirements = currentStepElement ? currentStepElement.querySelectorAll('.requirement') : [];
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };
    
    requirements.forEach(req => {
        const type = req.dataset.requirement;
        if (checks[type]) {
            req.classList.add('met');
        } else {
            req.classList.remove('met');
        }
    });
}

function validatePasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    return strength.score >= 3; // Al menos 3 de 5 criterios
}

// TOGGLE DE CONTRASEÑA
function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentNode.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
            
            // Animación
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// COINCIDENCIA DE CONTRASEÑAS
function initPasswordMatch() {
    const confirmInput = document.getElementById('confirm_password');
    
    confirmInput.addEventListener('input', checkPasswordMatch);
}

function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const matchIndicator = document.querySelector('.password-match');
    
    if (!matchIndicator) return;
    
    if (confirmPassword === '') {
        matchIndicator.className = 'password-match';
        return;
    }
    
    if (password === confirmPassword) {
        matchIndicator.className = 'password-match match';
        matchIndicator.innerHTML = '<i class="fas fa-check"></i>';
    } else {
        matchIndicator.className = 'password-match no-match';
        matchIndicator.innerHTML = '<i class="fas fa-times"></i>';
    }
}

// ENVÍO DEL FORMULARIO
function initFormSubmission() {
    const form = document.getElementById('form-registro');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateFinalForm()) {
            processRegistration();
        }
    });
}

function validateFinalForm() {
    const form = document.getElementById('form-registro');
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    const requiredCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
    
    let isValid = true;
    
    // Validar campos requeridos
    requiredInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Validar checkboxes requeridos
    requiredCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            isValid = false;
            showError('Términos requeridos', 'Debes aceptar los términos y condiciones para continuar.');
        }
    });
    
    // Validar contraseñas
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    
    if (!validatePasswordStrength(password)) {
        isValid = false;
        showError('Contraseña débil', 'La contraseña debe cumplir con los requisitos mínimos de seguridad.');
    }
    
    if (password !== confirmPassword) {
        isValid = false;
        showError('Contraseñas diferentes', 'Las contraseñas no coinciden.');
    }
    
    return isValid;
}

function processRegistration() {
    const form = document.getElementById('form-registro');
    const formData = new FormData(form);
    const registerBtn = document.querySelector('.btn-register');
    const btnText = registerBtn.querySelector('.btn-text');
    const btnIcon = registerBtn.querySelector('.btn-icon');
    
    // Mostrar loading
    registerBtn.disabled = true;
    btnText.textContent = 'Creando cuenta...';
    btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
    
    // Preparar datos del usuario
    const userData = {
        id: generateUserId(),
        nombre: formData.get('nombre'),
        apellido: formData.get('apellido'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        fecha_nacimiento: formData.get('fecha_nacimiento'),
        password: formData.get('password'),
        interes: formData.get('interes'),
        newsletter: formData.get('newsletter') === 'on',
        promociones: formData.get('promociones') === 'on',
        role: 'user',
        fechaRegistro: new Date().toISOString(),
        verificado: false
    };
    
    // Simular proceso de registro
    setTimeout(() => {
        const resultado = registrarUsuario(userData);
        
        if (resultado.success) {
            // Registro exitoso
            btnText.textContent = '¡Cuenta creada!';
            btnIcon.className = 'fas fa-check btn-icon';
            registerBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            mostrarExito('¡Registro exitoso!', `¡Bienvenido ${userData.nombre}! Tu cuenta ha sido creada correctamente.`);
            
            // Auto-login después del registro
            setTimeout(() => {
                const sesion = {
                    usuario: userData,
                    fechaLogin: new Date().toISOString(),
                    recordar: false
                };
                
                sessionStorage.setItem('sesion_pethouse', JSON.stringify(sesion));
                
                // Redirigir al dashboard o página principal
                window.location.href = userData.role === 'admin' ? 'dashboard.html' : 'index.html';
            }, 2000);
            
        } else {
            // Error en el registro
            registerBtn.disabled = false;
            btnText.textContent = 'Crear Mi Cuenta';
            btnIcon.className = 'fas fa-rocket btn-icon';
            
            mostrarError('Error en el registro', resultado.mensaje);
        }
    }, 2000);
}

function registrarUsuario(userData) {
    try {
        // Obtener usuarios existentes
        const usuarios = JSON.parse(localStorage.getItem('usuarios_pethouse') || '[]');
        
        // Verificar si el email ya existe
        const emailExists = usuarios.some(user => user.email === userData.email);
        
        if (emailExists) {
            return {
                success: false,
                mensaje: 'Este email ya está registrado. Intenta con otro email o inicia sesión.'
            };
        }
        
        // Agregar nuevo usuario
        usuarios.push(userData);
        localStorage.setItem('usuarios_pethouse', JSON.stringify(usuarios));
        
        console.log('👤 Usuario registrado:', userData.nombre, userData.email);
        
        return {
            success: true,
            usuario: userData,
            mensaje: 'Registro exitoso'
        };
        
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return {
            success: false,
            mensaje: 'Error interno del servidor. Intenta nuevamente.'
        };
    }
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// UTILIDADES DE ANIMACIÓN
function animateButton(button, type = 'success') {
    const originalTransform = button.style.transform;
    
    if (type === 'success') {
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)';
    } else {
        button.style.animation = 'shake 0.5s ease-in-out';
    }
    
    setTimeout(() => {
        button.style.transform = originalTransform;
        button.style.animation = '';
        button.style.boxShadow = '';
    }, type === 'success' ? 300 : 500);
}

// CSS para animación shake
const shakeCSS = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeCSS;
document.head.appendChild(styleSheet);

// Estilos para campos con error/éxito
const fieldStatusCSS = `
    .form-group input.error {
        border-color: #dc2626 !important;
        background: #fef2f2 !important;
    }
    
    .form-group input.success {
        border-color: #10b981 !important;
        background: #f0fdf4 !important;
    }
    
    .form-group input.error:focus,
    .form-group input.success:focus {
        box-shadow: 0 0 0 3px rgba(var(--shadow-color), 0.1) !important;
    }
    
    .form-group input.error:focus {
        --shadow-color: 220, 38, 38;
    }
    
    .form-group input.success:focus {
        --shadow-color: 16, 185, 129;
    }
`;

const fieldStyleSheet = document.createElement('style');
fieldStyleSheet.textContent = fieldStatusCSS;
document.head.appendChild(fieldStyleSheet);

console.log('📝 Registro Moderno cargado completamente');