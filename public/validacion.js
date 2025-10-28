// Validación de formularios - PETHOUSE
// Sistema de validación robusto para formularios de registro y contacto

document.addEventListener("DOMContentLoaded", function() {
    // Inicializar validaciones
    initFormValidation();
    initContactFormValidation();
    initPasswordStrength();
});

// Funciones de utilidad para validación
const ValidationUtils = {
    // Validar email
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validar teléfono mexicano
    isValidPhoneMX: function(phone) {
        const phoneRegex = /^(\+52|52)?[\s-]?(\d{3})[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    // Validar contraseña fuerte
    isStrongPassword: function(password) {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            isValid: minLength && hasUpper && hasLower && hasNumber,
            score: [minLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length,
            criteria: { minLength, hasUpper, hasLower, hasNumber, hasSpecial }
        };
    },

    // Mostrar mensaje de error
    showError: function(input, message) {
        const errorDiv = input.parentNode.querySelector('.error-message') || 
                        this.createErrorElement();
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        if (!input.parentNode.querySelector('.error-message')) {
            input.parentNode.appendChild(errorDiv);
        }
        
        input.classList.add('error');
        input.classList.remove('valid');
    },

    // Mostrar mensaje de éxito
    showSuccess: function(input) {
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        
        input.classList.remove('error');
        input.classList.add('valid');
    },

    // Crear elemento de error
    createErrorElement: function() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.display = 'none';
        return errorDiv;
    }
};

// Validación del formulario de registro
function initFormValidation() {
    const registroForm = document.querySelector('.formulario-autenticacion');
    if (!registroForm) return;

    const inputs = {
        nombre: document.getElementById('nombre'),
        apellido: document.getElementById('apellido'),
        correo: document.getElementById('correo'),
        telefono: document.getElementById('telefono'),
        contraseña: document.getElementById('contraseña'),
        confirmarContraseña: document.getElementById('confirmar-contraseña'),
        interes: document.getElementById('interes')
    };

    // Validación en tiempo real
    Object.keys(inputs).forEach(key => {
        const input = inputs[key];
        if (input) {
            input.addEventListener('blur', () => validateField(input, key));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input, key);
                }
            });
        }
    });

    // Validación al enviar
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        Object.keys(inputs).forEach(key => {
            const input = inputs[key];
            if (input && !validateField(input, key)) {
                isValid = false;
            }
        });

        // Validar términos y condiciones
        const terminosCheckbox = document.querySelector('input[name="terminos"]');
        const privacidadCheckbox = document.querySelector('input[name="privacidad"]');
        
        if (!terminosCheckbox?.checked) {
            alert('Debes aceptar los Términos y Condiciones');
            isValid = false;
        }

        if (!privacidadCheckbox?.checked) {
            alert('Debes aceptar la Política de Privacidad');
            isValid = false;
        }

        if (isValid) {
            showSuccessMessage('Registro exitoso. Redirigiendo al inicio...');
            setTimeout(() => {
                window.location.href = 'Inicio.html';
            }, 2000);
        }
    });
}

// Validación del formulario de contacto
function initContactFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const motivo = document.getElementById('motivo');
        const mensaje = document.getElementById('mensaje');

        let isValid = true;

        // Validar nombre
        if (!nombre.value.trim() || nombre.value.length < 2) {
            ValidationUtils.showError(nombre, 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        } else {
            ValidationUtils.showSuccess(nombre);
        }

        // Validar email
        if (!ValidationUtils.isValidEmail(email.value)) {
            ValidationUtils.showError(email, 'Por favor, ingresa un email válido');
            isValid = false;
        } else {
            ValidationUtils.showSuccess(email);
        }

        // Validar motivo
        if (!motivo.value) {
            ValidationUtils.showError(motivo, 'Por favor, selecciona un motivo de contacto');
            isValid = false;
        } else {
            ValidationUtils.showSuccess(motivo);
        }

        // Validar mensaje
        if (!mensaje.value.trim() || mensaje.value.length < 10) {
            ValidationUtils.showError(mensaje, 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        } else {
            ValidationUtils.showSuccess(mensaje);
        }

        if (isValid) {
            showSuccessMessage('Mensaje enviado correctamente. Te contactaremos pronto.');
            contactForm.reset();
        }
    });
}

// Validar campo individual
function validateField(input, fieldType) {
    const value = input.value.trim();
    let isValid = true;

    switch(fieldType) {
        case 'nombre':
        case 'apellido':
            if (!value || value.length < 2) {
                ValidationUtils.showError(input, 'Debe tener al menos 2 caracteres');
                isValid = false;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                ValidationUtils.showError(input, 'Solo se permiten letras');
                isValid = false;
            } else {
                ValidationUtils.showSuccess(input);
            }
            break;

        case 'correo':
            if (!ValidationUtils.isValidEmail(value)) {
                ValidationUtils.showError(input, 'Email inválido (ejemplo: user@dominio.com)');
                isValid = false;
            } else {
                ValidationUtils.showSuccess(input);
            }
            break;

        case 'telefono':
            if (value && !ValidationUtils.isValidPhoneMX(value)) {
                ValidationUtils.showError(input, 'Formato: +52 XXX XXX XX XX');
                isValid = false;
            } else {
                ValidationUtils.showSuccess(input);
            }
            break;

        case 'contraseña':
            const passwordCheck = ValidationUtils.isStrongPassword(value);
            if (!passwordCheck.isValid) {
                let message = 'La contraseña debe tener: ';
                const missing = [];
                if (!passwordCheck.criteria.minLength) missing.push('8+ caracteres');
                if (!passwordCheck.criteria.hasUpper) missing.push('mayúscula');
                if (!passwordCheck.criteria.hasLower) missing.push('minúscula');
                if (!passwordCheck.criteria.hasNumber) missing.push('número');
                
                ValidationUtils.showError(input, message + missing.join(', '));
                isValid = false;
            } else {
                ValidationUtils.showSuccess(input);
                // Validar confirmación si existe
                const confirmInput = document.getElementById('confirmar-contraseña');
                if (confirmInput && confirmInput.value) {
                    validateField(confirmInput, 'confirmarContraseña');
                }
            }
            break;

        case 'confirmarContraseña':
            const originalPassword = document.getElementById('contraseña')?.value;
            if (value !== originalPassword) {
                ValidationUtils.showError(input, 'Las contraseñas no coinciden');
                isValid = false;
            } else {
                ValidationUtils.showSuccess(input);
            }
            break;

        case 'interes':
            if (!value) {
                ValidationUtils.showError(input, 'Por favor selecciona una opción');
                isValid = false;
            } else {
                ValidationUtils.showSuccess(input);
            }
            break;
    }

    return isValid;
}

// Indicador de fortaleza de contraseña mejorado
function initPasswordStrength() {
    const passwordInput = document.getElementById('contraseña');
    if (!passwordInput) return;

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthCheck = ValidationUtils.isStrongPassword(password);
        
        updatePasswordStrengthIndicator(strengthCheck);
    });
}

function updatePasswordStrengthIndicator(strengthCheck) {
    const barra = document.querySelector('.relleno-fortaleza');
    const texto = document.querySelector('.texto-fortaleza');
    
    if (!barra || !texto) return;

    const score = strengthCheck.score;
    const colors = ['#ff6b6b', '#ffa726', '#ffcc02', '#8bc34a', '#4caf50'];
    const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    
    barra.style.width = `${(score / 5) * 100}%`;
    barra.style.backgroundColor = colors[score - 1] || colors[0];
    texto.textContent = labels[score - 1] || labels[0];
    
    // Mostrar criterios
    const criteriaDiv = document.querySelector('.password-criteria') || createCriteriaDiv();
    updateCriteriaDisplay(criteriaDiv, strengthCheck.criteria);
}

function createCriteriaDiv() {
    const criteriaDiv = document.createElement('div');
    criteriaDiv.className = 'password-criteria';
    criteriaDiv.style.fontSize = '12px';
    criteriaDiv.style.marginTop = '5px';
    
    const passwordContainer = document.querySelector('.relleno-fortaleza').parentNode.parentNode;
    passwordContainer.appendChild(criteriaDiv);
    
    return criteriaDiv;
}

function updateCriteriaDisplay(criteriaDiv, criteria) {
    const criteriaList = [
        { key: 'minLength', label: '8+ caracteres' },
        { key: 'hasUpper', label: 'Mayúscula' },
        { key: 'hasLower', label: 'Minúscula' },
        { key: 'hasNumber', label: 'Número' }
    ];
    
    criteriaDiv.innerHTML = criteriaList.map(item => 
        `<span style="color: ${criteria[item.key] ? '#4caf50' : '#ff6b6b'};">
            ${criteria[item.key] ? '✓' : '✗'} ${item.label}
        </span>`
    ).join(' | ');
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    // Crear modal de éxito
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; padding: 30px; border-radius: 15px; text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3); z-index: 10000;
        max-width: 400px; width: 90%;
    `;
    
    modal.innerHTML = `
        <div style="color: #4caf50; font-size: 48px; margin-bottom: 20px;">✓</div>
        <h3 style="color: #333; margin-bottom: 10px;">¡Éxito!</h3>
        <p style="color: #666;">${message}</p>
    `;
    
    // Overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    }, 3000);
}

// Estilos CSS para la validación
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .error {
        border-color: #ff6b6b !important;
        box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2) !important;
    }
    
    .valid {
        border-color: #4caf50 !important;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2) !important;
    }
    
    .error-message {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

document.head.appendChild(validationStyles);