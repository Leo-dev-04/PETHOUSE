// ========================================
//   CONTACTO MODERNO - FUNCIONALIDAD AVANZADA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initContactoModerno();
});

function initContactoModerno() {
    console.log('📞 Inicializando Contacto Moderno...');
    
    // Inicializar funcionalidades
    initQuickActions();
    initFormValidation();
    initConditionalFields();
    initFileUpload();
    initCharacterCounter();
    initFormSubmission();
    initFAQ();
    
    console.log('✅ Contacto Moderno inicializado correctamente');
}

// ACCIONES RÁPIDAS
function initQuickActions() {
    const quickBtns = document.querySelectorAll('.quick-btn');
    
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            
            // Scroll al formulario
            document.querySelector('.form-section').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Rellenar motivo según la acción
            setTimeout(() => {
                const motivoSelect = document.getElementById('motivo');
                
                switch(action) {
                    case 'adopcion':
                        motivoSelect.value = 'adopcion';
                        document.getElementById('mensaje').placeholder = 'Cuéntanos qué tipo de mascota te gustaría adoptar, tu experiencia con animales, y cualquier preferencia específica...';
                        break;
                    case 'urgente':
                        motivoSelect.value = 'rescate';
                        document.getElementById('mensaje').placeholder = 'Describe la situación del animal: estado de salud, ubicación exacta, nivel de urgencia...';
                        break;
                    case 'voluntario':
                        motivoSelect.value = 'voluntario';
                        document.getElementById('mensaje').placeholder = 'Cuéntanos sobre ti: disponibilidad de tiempo, experiencia con animales, qué actividades te interesan más...';
                        break;
                }
                
                // Trigger change event para mostrar campos condicionales
                motivoSelect.dispatchEvent(new Event('change'));
                
                // Animar botón
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
            }, 500);
        });
    });
}

// VALIDACIÓN DEL FORMULARIO
function initFormValidation() {
    const form = document.getElementById('form-contacto');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
            
            // Validaciones específicas en tiempo real
            if (this.type === 'email') {
                validateEmail(this);
            }
            
            if (this.type === 'tel') {
                validatePhone(this);
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
    }
    
    // Validaciones específicas por campo
    switch (field.id) {
        case 'nombre':
            if (value && value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
            
        case 'mensaje':
            if (value && value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
            if (value && value.length > 500) {
                isValid = false;
                errorMessage = 'El mensaje no puede exceder 500 caracteres';
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

function validateEmail(emailInput) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && emailRegex.test(email)) {
        showFieldSuccess(emailInput);
    }
}

function validatePhone(phoneInput) {
    const phone = phoneInput.value.trim();
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    
    if (phone && phoneRegex.test(phone)) {
        showFieldSuccess(phoneInput);
    }
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

// CAMPOS CONDICIONALES
function initConditionalFields() {
    const motivoSelect = document.getElementById('motivo');
    
    motivoSelect.addEventListener('change', function() {
        showConditionalFields(this.value);
    });
}

function showConditionalFields(motivo) {
    const urgenciaGroup = document.querySelector('.urgencia-group');
    const ubicacionGroup = document.querySelector('.ubicacion-group');
    const adjuntosGroup = document.querySelector('.adjuntos-group');
    
    // Ocultar todos los campos condicionales
    urgenciaGroup.style.display = 'none';
    ubicacionGroup.style.display = 'none';
    adjuntosGroup.style.display = 'none';
    
    // Mostrar campos según el motivo
    switch(motivo) {
        case 'rescate':
            urgenciaGroup.style.display = 'block';
            ubicacionGroup.style.display = 'block';
            adjuntosGroup.style.display = 'block';
            
            // Hacer campos requeridos
            document.getElementById('urgencia').setAttribute('required', 'required');
            document.getElementById('ubicacion').setAttribute('required', 'required');
            break;
            
        case 'visita':
            ubicacionGroup.style.display = 'block';
            break;
            
        default:
            // Remover requerimientos
            document.getElementById('urgencia').removeAttribute('required');
            document.getElementById('ubicacion').removeAttribute('required');
            break;
    }
}

// CARGA DE ARCHIVOS
function initFileUpload() {
    const fileUploadArea = document.getElementById('file-upload');
    const fileInput = document.getElementById('adjuntos');
    const uploadedFilesContainer = document.querySelector('.uploaded-files');
    
    if (!fileUploadArea || !fileInput) return;
    
    // Click para seleccionar archivos
    fileUploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Drag and drop
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // Selección de archivos
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                if (file.size <= 5 * 1024 * 1024) { // 5MB máximo
                    displayUploadedFile(file);
                } else {
                    mostrarError('Archivo muy grande', `El archivo ${file.name} es muy grande. Máximo 5MB por imagen.`);
                }
            } else {
                mostrarError('Tipo de archivo no válido', `Solo se permiten imágenes. ${file.name} no es válido.`);
            }
        });
    }
    
    function displayUploadedFile(file) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'uploaded-file';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            fileDiv.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <div class="uploaded-file-info">
                    <div class="uploaded-file-name">${file.name}</div>
                    <div class="uploaded-file-size">${formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="uploaded-file-remove">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Evento para remover archivo
            fileDiv.querySelector('.uploaded-file-remove').addEventListener('click', function() {
                fileDiv.remove();
            });
            
            uploadedFilesContainer.appendChild(fileDiv);
        };
        
        reader.readAsDataURL(file);
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// CONTADOR DE CARACTERES
function initCharacterCounter() {
    const mensajeTextarea = document.getElementById('mensaje');
    const charCounter = document.querySelector('.char-counter');
    const currentSpan = charCounter.querySelector('.current');
    const maxChars = 500;
    
    mensajeTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        currentSpan.textContent = currentLength;
        
        // Cambiar color según el progreso
        charCounter.classList.remove('warning', 'error');
        
        if (currentLength > maxChars * 0.8) {
            charCounter.classList.add('warning');
        }
        
        if (currentLength > maxChars) {
            charCounter.classList.add('error');
            this.value = this.value.substring(0, maxChars);
            currentSpan.textContent = maxChars;
        }
    });
}

// ENVÍO DEL FORMULARIO
function initFormSubmission() {
    const form = document.getElementById('form-contacto');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            processContactForm();
        }
    });
}

function validateForm() {
    const form = document.getElementById('form-contacto');
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        mostrarError('Formulario incompleto', 'Por favor completa todos los campos requeridos.');
        
        // Scroll al primer error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
    
    return isValid;
}

function processContactForm() {
    const form = document.getElementById('form-contacto');
    const formData = new FormData(form);
    const submitBtn = document.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    
    // Mostrar loading
    submitBtn.disabled = true;
    btnText.textContent = 'Enviando mensaje...';
    btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
    
    // Preparar datos del mensaje
    const messageData = {
        id: generateMessageId(),
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
        motivo: formData.get('motivo'),
        urgencia: formData.get('urgencia'),
        ubicacion: formData.get('ubicacion'),
        mensaje: formData.get('mensaje'),
        copy_email: formData.get('copy_email') === 'on',
        newsletter: formData.get('newsletter') === 'on',
        fecha: new Date().toISOString(),
        estado: 'pendiente'
    };
    
    // Simular envío del mensaje
    setTimeout(() => {
        const resultado = enviarMensaje(messageData);
        
        if (resultado.success) {
            // Mensaje enviado exitosamente
            btnText.textContent = '¡Mensaje enviado!';
            btnIcon.className = 'fas fa-check btn-icon';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            mostrarExito('¡Mensaje enviado!', 
                `Gracias ${messageData.nombre}. Hemos recibido tu mensaje y te responderemos pronto.`);
            
            // Enviar confirmación por email si se solicita
            if (messageData.copy_email) {
                setTimeout(() => {
                    mostrarInfo('Copia enviada', 'Te hemos enviado una copia del mensaje a tu email.');
                }, 1000);
            }
            
            // Limpiar formulario después de 3 segundos
            setTimeout(() => {
                form.reset();
                hideConditionalFields();
                clearAllFieldStates();
                
                // Resetear botón
                submitBtn.disabled = false;
                btnText.textContent = 'Enviar mensaje';
                btnIcon.className = 'fas fa-paper-plane btn-icon';
                submitBtn.style.background = '';
                
                // Scroll al inicio
                document.querySelector('.hero-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                
            }, 3000);
            
        } else {
            // Error al enviar
            submitBtn.disabled = false;
            btnText.textContent = 'Enviar mensaje';
            btnIcon.className = 'fas fa-paper-plane btn-icon';
            
            mostrarError('Error al enviar', resultado.mensaje);
        }
    }, 2000);
}

function enviarMensaje(messageData) {
    try {
        // Guardar mensaje en localStorage (simulando base de datos)
        const mensajes = JSON.parse(localStorage.getItem('mensajes_pethouse') || '[]');
        mensajes.push(messageData);
        localStorage.setItem('mensajes_pethouse', JSON.stringify(mensajes));
        
        // Determinar prioridad según el motivo
        let prioridad = 'normal';
        if (messageData.motivo === 'rescate') {
            switch(messageData.urgencia) {
                case 'critica':
                    prioridad = 'crítica';
                    break;
                case 'alta':
                    prioridad = 'alta';
                    break;
                case 'media':
                    prioridad = 'media';
                    break;
                default:
                    prioridad = 'normal';
            }
        }
        
        console.log(`📧 Mensaje recibido (${prioridad}):`, messageData.nombre, messageData.motivo);
        
        return {
            success: true,
            id: messageData.id,
            prioridad: prioridad,
            mensaje: 'Mensaje enviado correctamente'
        };
        
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        return {
            success: false,
            mensaje: 'Error interno del servidor. Intenta nuevamente.'
        };
    }
}

function generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

function hideConditionalFields() {
    document.querySelector('.urgencia-group').style.display = 'none';
    document.querySelector('.ubicacion-group').style.display = 'none';
    document.querySelector('.adjuntos-group').style.display = 'none';
}

function clearAllFieldStates() {
    const form = document.getElementById('form-contacto');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    // Limpiar mensajes de error
    const errorMessages = form.querySelectorAll('.field-error');
    errorMessages.forEach(msg => msg.remove());
    
    // Limpiar archivos subidos
    const uploadedFiles = document.querySelector('.uploaded-files');
    if (uploadedFiles) {
        uploadedFiles.innerHTML = '';
    }
    
    // Resetear contador de caracteres
    const charCounter = document.querySelector('.char-counter');
    const currentSpan = charCounter.querySelector('.current');
    currentSpan.textContent = '0';
    charCounter.classList.remove('warning', 'error');
}

// FAQ INTERACTIVO
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Cerrar todas las preguntas
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Abrir la pregunta actual si no estaba activa
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// UTILIDADES DE MENSAJES
function mostrarInfo(titulo, mensaje) {
    const infoAlert = document.createElement('div');
    infoAlert.className = 'alert alert-info';
    infoAlert.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: #eff6ff;
        border: 1px solid #93c5fd;
        color: #1d4ed8;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    infoAlert.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-info-circle" style="font-size: 1.2rem;"></i>
            <div>
                <h4 style="margin: 0 0 0.25rem 0; font-weight: 600;">${titulo}</h4>
                <p style="margin: 0; font-size: 0.9rem;">${mensaje}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(infoAlert);
    
    setTimeout(() => {
        infoAlert.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            infoAlert.remove();
        }, 300);
    }, 4000);
}

// CSS para animaciones de notificaciones
const notificationCSS = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationCSS;
document.head.appendChild(styleSheet);

console.log('📞 Contacto Moderno cargado completamente');