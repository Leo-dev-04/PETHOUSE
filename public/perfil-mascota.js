// ========================================
//   PERFIL-MASCOTA.JS - PERFILES INDIVIDUALES
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initPerfilMascota();
});

// Base de datos simulada de mascotas (sincronizada con adopciones-moderno.js)
const MASCOTAS_DATABASE = [
    {
        id: 1,
        nombre: "Luna",
        tipo: "perro",
        edad: "joven",
        edadExacta: "2 años",
        tamaño: "grande",
        genero: "hembra",
        raza: "Golden Retriever",
        descripcion: "Luna es una perra increíblemente dulce y cariñosa. Le encanta jugar con niños y otros perros. Es muy inteligente y ya conoce comandos básicos.",
        personalidad: ["Cariñosa", "Juguetona", "Inteligente", "Sociable"],
        imagen: "../assets/images/perro.png",
        imagenes: ["../assets/images/perro.png", "../assets/images/perro2.webp", "../assets/images/perrofeliz.webp"],
        vacunado: true,
        esterilizado: true,
        microchip: true,
        peso: "28 kg",
        color: "Dorado",
        historia: "Luna fue rescatada de la calle cuando era cachorra. Ha sido cuidada con amor y está lista para encontrar su hogar definitivo.",
        necesidades: "Ejercicio diario, espacio amplio, socialización",
        cuidadosEspeciales: "Ninguno",
        organizacion: "Fundación Patitas Felices",
        contactoOrg: {
            telefono: "+52 555 123 4567",
            email: "contacto@patitasfelices.org",
            direccion: "Av. Insurgentes #123, CDMX"
        },
        ubicacion: "Chicontepec, Veracruz",
        fechaIngreso: "2024-01-15",
        fechaNacimiento: "2022-01-15",
        estado: "disponible",
        compatibilidad: {
            niños: "Excelente",
            otrasmascotas: "Excelente", 
            apartamento: "No recomendado"
        },
        nivel_actividad: "Alto",
        nivel_cuidado: "Medio"
    },
    {
        id: 2,
        nombre: "Milo",
        tipo: "gato",
        edad: "joven",
        edadExacta: "1 año",
        tamaño: "mediano",
        genero: "macho",
        raza: "Mestizo",
        descripcion: "Milo es un gato joven y curioso. Le gusta explorar y es muy independiente, pero también disfruta de las caricias y el tiempo de calidad.",
        personalidad: ["Independiente", "Tranquilo", "Curioso", "Sociable"],
        imagen: "../assets/images/gata.jpg",
        imagenes: ["../assets/images/gata.jpg", "../assets/images/coco.jpg", "../assets/images/coco2.jpeg"],
        vacunado: true,
        esterilizado: true,
        microchip: true,
        peso: "4 kg",
        color: "Atigrado gris",
        historia: "Milo llegó a nosotros cuando su familia anterior no pudo seguir cuidándolo. Es un gato sano y sociable.",
        necesidades: "Ambiente tranquilo, juguetes interactivos, acceso a ventanas",
        cuidadosEspeciales: "Ninguno",
        organizacion: "Refugio Felino Esperanza",
        contactoOrg: {
            telefono: "+52 555 234 5678",
            email: "adopciones@felinoesperanza.org",
            direccion: "Calle Roma #456, Condesa, CDMX"
        },
        ubicacion: "Chicontepec, Veracruz",
        fechaIngreso: "2024-01-20",
        fechaNacimiento: "2023-01-20",
        estado: "disponible",
        compatibilidad: {
            niños: "Excelente",
            otrasmascotas: "Excelente",
            apartamento: "Perfecta"
        },
        nivel_actividad: "Medio",
        nivel_cuidado: "Bajo"
    },
    {
        id: 3,
        nombre: "Rocky",
        tipo: "perro",
        edad: "adulto",
        edadExacta: "3 años",
        tamaño: "grande",
        genero: "macho",
        raza: "Pitbull",
        descripcion: "Rocky es un perro noble y protector. A pesar de su apariencia fuerte, es muy gentil y cariñoso con su familia. Necesita un dueño experimentado que entienda su raza.",
        personalidad: ["Noble", "Protector", "Gentil", "Leal", "Calmado"],
        imagen: "../assets/images/pit.jpg",
        imagenes: ["../assets/images/pit.jpg"],
        vacunado: true,
        esterilizado: true,
        microchip: true,
        peso: "28 kg",
        color: "Atigrado",
        historia: "Rocky llegó al refugio después de que su familia anterior no pudiera seguir cuidándolo. Es un perro bien educado que necesita una familia que entienda su raza y le brinde el amor y estructura que merece.",
        necesidades: "Dueño experimentado, socialización continua, ejercicio regular, hogar sin niños pequeños",
        cuidadosEspeciales: "Requiere dueño con experiencia en razas fuertes",
        organizacion: "Fundación Segunda Oportunidad",
        contactoOrg: {
            telefono: "+57 300 345 6789",
            email: "info@segundaoportunidad.org",
            direccion: "Avenida 6 #55-12, El Poblado, Cali"
        },
        ubicacion: "Cali, Colombia",
        fechaIngreso: "2024-01-20",
        fechaNacimiento: "2021-08-15",
        estado: "disponible",
        compatibilidad: {
            niños: "Solo mayores de 12 años",
            otrasmascotas: "Selectiva",
            apartamento: "Posible con ejercicio"
        },
        nivel_actividad: "Medio-Alto",
        nivel_cuidado: "Alto"
    }
];

let mascotaActual = null;
let imagenActualIndex = 0;

function initPerfilMascota() {
    console.log('🐾 Iniciando sistema de perfil de mascota...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const mascotaId = parseInt(urlParams.get('id'));
    const action = urlParams.get('action');
    
    console.log('📋 Parámetros URL:', { mascotaId, action });
    
    if (mascotaId && !isNaN(mascotaId)) {
        cargarPerfilMascota(mascotaId);
        
        // Si viene con action=adopt, abrir modal de adopción después de cargar
        if (action === 'adopt') {
            setTimeout(() => {
                if (mascotaActual) {
                    console.log('🐕 Abriendo formulario de adopción automáticamente');
                    const modalAdopcion = document.getElementById('modal-adopcion');
                    if (modalAdopcion) {
                        modalAdopcion.style.display = 'block';
                    }
                }
            }, 2000); // Esperar a que se cargue el perfil
        }
    } else {
        console.log('❌ ID de mascota no válido');
        mostrarError404();
    }
    
    setupModales();
    console.log('🐾 Sistema de perfil de mascota inicializado');
}

function cargarPerfilMascota(id) {
    // Simular carga mínima para mejor UX
    setTimeout(() => {
        mascotaActual = MASCOTAS_DATABASE.find(m => m.id === id);
        
        if (mascotaActual) {
            mostrarPerfilMascota(mascotaActual);
            cargarMascotasRelacionadas(mascotaActual);
        } else {
            mostrarError404();
        }
    }, 300); // Reducido a 300ms para carga más rápida
}

function mostrarPerfilMascota(mascota) {
    // Actualizar título de la página
    document.title = `${mascota.nombre} - Perfil de Adopción | PETHOUSE`;
    
    // Actualizar breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-mascota');
    if (breadcrumb) {
        breadcrumb.textContent = mascota.nombre;
    }
    
    const container = document.getElementById('perfil-container');
    if (container) {
        container.innerHTML = generarHTMLPerfil(mascota);
        container.style.display = 'block';
        container.style.opacity = '0';
        
        // Animar entrada suave
        setTimeout(() => {
            container.style.transition = 'opacity 0.3s ease-in';
            container.style.opacity = '1';
        }, 50);
        
        // Configurar event listeners
        setupPerfilEventListeners(mascota);
    }
}

function generarHTMLPerfil(mascota) {
    const edad = calcularEdadDetallada(mascota.fechaNacimiento);
    const tiempoEnRefugio = calcularTiempoEnRefugio(mascota.fechaIngreso);
    
    return `
        <div class="perfil-container">
            <!-- TARJETA PRINCIPAL DE MASCOTA -->
            <div class="mascota-main-card">
                <div class="mascota-header">
                    <img src="${mascota.imagen}" alt="${mascota.nombre}" class="mascota-image" onclick="abrirGaleria(0)">
                    
                    <div class="mascota-status">
                        <i class="fas fa-heart"></i>
                        ${mascota.estado === 'disponible' ? 'Disponible' : 'No disponible'}
                    </div>
                    
                    ${mascota.badges && mascota.badges.length > 0 ? `
                        <div class="mascota-badges">
                            ${mascota.badges.map(badge => `
                                <span class="badge ${badge}">${badge}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="mascota-overlay">
                        <h1 class="mascota-name">${mascota.nombre}</h1>
                        <div class="mascota-basic-info">
                            <span>${mascota.tipo === 'perro' ? '🐕' : '🐱'} ${mascota.raza}</span>
                            <span>⚥ ${mascota.genero === 'macho' ? 'Macho' : 'Hembra'}</span>
                            <span>🎂 ${edad}</span>
                            <span>⚖️ ${mascota.peso}</span>
                        </div>
                    </div>
                </div>
                
                <div class="mascota-content">
                    <p class="mascota-description">${mascota.descripcion}</p>
                    
                    <div class="personalidad-tags">
                        ${mascota.personalidad.map(trait => `
                            <span class="personality-tag">${trait}</span>
                        `).join('')}
                    </div>
                    
                    <div class="mascota-actions">
                        <button class="btn-primary btn-adoptar" onclick="abrirFormularioAdopcion()">
                            <i class="fas fa-heart"></i>
                            <span>¡Adoptar a ${mascota.nombre}!</span>
                        </button>
                        <button class="btn-secondary" onclick="compartirMascota()">
                            <i class="fas fa-share"></i>
                            Compartir
                        </button>
                        <button class="btn-secondary" onclick="contactarOrganizacion()">
                            <i class="fas fa-phone"></i>
                            Contactar
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- INFORMACIÓN DETALLADA (SIDEBAR) -->
            <div class="mascota-details">
                <!-- INFORMACIÓN BÁSICA -->
                <div class="detail-card">
                    <h3><i class="fas fa-info-circle"></i> Información Básica</h3>
                    <ul class="detail-list">
                        <li>
                            <span class="label">Nombre</span>
                            <span class="value">${mascota.nombre}</span>
                        </li>
                        <li>
                            <span class="label">Especie</span>
                            <span class="value">${mascota.tipo === 'perro' ? 'Perro' : 'Gato'}</span>
                        </li>
                        <li>
                            <span class="label">Raza</span>
                            <span class="value">${mascota.raza}</span>
                        </li>
                        <li>
                            <span class="label">Género</span>
                            <span class="value">${mascota.genero === 'macho' ? 'Macho' : 'Hembra'}</span>
                        </li>
                        <li>
                            <span class="label">Edad</span>
                            <span class="value">${edad}</span>
                        </li>
                        <li>
                            <span class="label">Peso</span>
                            <span class="value">${mascota.peso}</span>
                        </li>
                        <li>
                            <span class="label">Tamaño</span>
                            <span class="value">${mascota.tamaño.charAt(0).toUpperCase() + mascota.tamaño.slice(1)}</span>
                        </li>
                        <li>
                            <span class="label">Color</span>
                            <span class="value">${mascota.color}</span>
                        </li>
                    </ul>
                </div>
                
                <!-- SALUD -->
                <div class="detail-card">
                    <h3><i class="fas fa-heartbeat"></i> Estado de Salud</h3>
                    <ul class="detail-list">
                        <li>
                            <span class="label">Vacunado</span>
                            <span class="value">
                                <i class="fas fa-${mascota.vacunado ? 'check-circle' : 'times-circle'}" 
                                   style="color: ${mascota.vacunado ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                ${mascota.vacunado ? 'Sí' : 'No'}
                            </span>
                        </li>
                        <li>
                            <span class="label">Esterilizado</span>
                            <span class="value">
                                <i class="fas fa-${mascota.esterilizado ? 'check-circle' : 'times-circle'}" 
                                   style="color: ${mascota.esterilizado ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                ${mascota.esterilizado ? 'Sí' : 'No'}
                            </span>
                        </li>
                        <li>
                            <span class="label">Microchip</span>
                            <span class="value">
                                <i class="fas fa-${mascota.microchip ? 'check-circle' : 'times-circle'}" 
                                   style="color: ${mascota.microchip ? 'var(--success-color)' : 'var(--accent-color)'}"></i>
                                ${mascota.microchip ? 'Sí' : 'No'}
                            </span>
                        </li>
                        <li>
                            <span class="label">Cuidados especiales</span>
                            <span class="value">${mascota.cuidadosEspeciales}</span>
                        </li>
                    </ul>
                </div>
                
                <!-- COMPATIBILIDAD -->
                <div class="detail-card">
                    <h3><i class="fas fa-users"></i> Compatibilidad</h3>
                    <div class="compatibility-grid">
                        <div class="compatibility-item ${getCompatibilityClass(mascota.compatibilidad.niños)}">
                            <i class="fas fa-child"></i>
                            <div>
                                <strong>Niños</strong>
                                <br><span>${mascota.compatibilidad.niños}</span>
                            </div>
                        </div>
                        <div class="compatibility-item ${getCompatibilityClass(mascota.compatibilidad.otrasmascotas)}">
                            <i class="fas fa-paw"></i>
                            <div>
                                <strong>Otras mascotas</strong>
                                <br><span>${mascota.compatibilidad.otrasmascotas}</span>
                            </div>
                        </div>
                        <div class="compatibility-item ${getCompatibilityClass(mascota.compatibilidad.apartamento)}">
                            <i class="fas fa-building"></i>
                            <div>
                                <strong>Apartamento</strong>
                                <br><span>${mascota.compatibilidad.apartamento}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- ORGANIZACIÓN -->
                <div class="detail-card">
                    <h3><i class="fas fa-building"></i> Organización</h3>
                    <ul class="detail-list">
                        <li>
                            <span class="label">Organización</span>
                            <span class="value">${mascota.organizacion}</span>
                        </li>
                        <li>
                            <span class="label">Ubicación</span>
                            <span class="value">${mascota.ubicacion}</span>
                        </li>
                        <li>
                            <span class="label">Teléfono</span>
                            <span class="value">${mascota.contactoOrg.telefono}</span>
                        </li>
                        <li>
                            <span class="label">Email</span>
                            <span class="value">${mascota.contactoOrg.email}</span>
                        </li>
                        <li>
                            <span class="label">Tiempo en refugio</span>
                            <span class="value">${tiempoEnRefugio}</span>
                        </li>
                    </ul>
                </div>
                
                <!-- GALERÍA DE IMÁGENES -->
                ${mascota.imagenes.length > 1 ? `
                    <div class="detail-card">
                        <h3><i class="fas fa-images"></i> Galería (${mascota.imagenes.length} fotos)</h3>
                        <div class="galeria-thumbnails">
                            ${mascota.imagenes.map((img, index) => `
                                <img src="${img}" 
                                     alt="${mascota.nombre} ${index + 1}" 
                                     class="thumbnail ${index === 0 ? 'active' : ''}"
                                     onclick="cambiarImagenPrincipal('${img}', ${index})">
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <!-- HISTORIA Y NECESIDADES -->
        <div class="container" style="margin-top: 2rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div class="detail-card">
                    <h3><i class="fas fa-book"></i> Historia de ${mascota.nombre}</h3>
                    <p style="color: var(--gray-700); line-height: 1.7;">${mascota.historia}</p>
                </div>
                
                <div class="detail-card">
                    <h3><i class="fas fa-clipboard-list"></i> Necesidades</h3>
                    <p style="color: var(--gray-700); line-height: 1.7;">${mascota.necesidades}</p>
                </div>
            </div>
        </div>
    `;
}

// Función auxiliar para determinar la clase de compatibilidad
function getCompatibilityClass(value) {
    if (typeof value === 'boolean') {
        return value ? '' : 'error';
    }
    
    const lowerValue = value.toLowerCase();
    if (lowerValue.includes('excelente') || lowerValue.includes('perfecta') || lowerValue.includes('sí')) {
        return '';
    } else if (lowerValue.includes('buena') || lowerValue.includes('posible')) {
        return 'warning';
    } else {
        return 'error';
    }
}

function setupPerfilEventListeners(mascota) {
    // Configurar thumbnails de galería si existen
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (thumbnails.length > 0) {
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                // Cambiar imagen principal
                const mainImage = document.querySelector('.mascota-image');
                if (mainImage) {
                    mainImage.src = thumb.src;
                }
                
                // Actualizar active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                imagenActualIndex = index;
            });
        });
    }
    
    // Configurar modal de adopción
    const modalAdopcion = document.getElementById('modal-adopcion');
    const modalClose = document.querySelector('.modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalAdopcion.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (modalAdopcion) {
        modalAdopcion.addEventListener('click', (e) => {
            if (e.target === modalAdopcion) {
                modalAdopcion.style.display = 'none';
            }
        });
    }
    
    // Configurar formulario de adopción
    const formAdopcion = document.getElementById('form-solicitud-adopcion');
    if (formAdopcion) {
        formAdopcion.addEventListener('submit', manejarSubmitFormulario);
    }
    
    // Botón cancelar del formulario
    const btnCancel = document.querySelector('.btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            modalAdopcion.style.display = 'none';
        });
    }
    
    console.log('🐾 Event listeners configurados para', mascota.nombre);
}

function cambiarTab(tabId) {
    // Remover active de todos los tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Activar tab seleccionado
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

function cambiarImagenPrincipal(src, index) {
    document.getElementById('imagen-principal').src = src;
    
    // Actualizar thumbnail activo
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    document.querySelectorAll('.thumbnail')[index].classList.add('active');
    
    imagenActualIndex = index;
}

function abrirGaleria(index = 0) {
    if (!mascotaActual || mascotaActual.imagenes.length <= 1) return;
    
    const modal = document.getElementById('modal-galeria');
    const imagen = document.getElementById('galeria-imagen');
    const thumbnails = document.getElementById('galeria-thumbnails');
    
    imagenActualIndex = index;
    imagen.src = mascotaActual.imagenes[index];
    
    // Crear thumbnails
    thumbnails.innerHTML = mascotaActual.imagenes.map((img, i) => `
        <img src="${img}" 
            alt="${mascotaActual.nombre} ${i + 1}" 
            class="thumb-mini ${i === index ? 'active' : ''}"
            onclick="cambiarImagenGaleria(${i})">
    `).join('');
    
    modal.style.display = 'block';
}

function cambiarImagenGaleria(index) {
    const imagen = document.getElementById('galeria-imagen');
    imagen.src = mascotaActual.imagenes[index];
    imagenActualIndex = index;
    
    // Actualizar thumbnail activo
    document.querySelectorAll('.thumb-mini').forEach(thumb => thumb.classList.remove('active'));
    document.querySelectorAll('.thumb-mini')[index].classList.add('active');
}

function navegarGaleria(direccion) {
    const total = mascotaActual.imagenes.length;
    
    if (direccion === 'anterior') {
        imagenActualIndex = imagenActualIndex > 0 ? imagenActualIndex - 1 : total - 1;
    } else {
        imagenActualIndex = imagenActualIndex < total - 1 ? imagenActualIndex + 1 : 0;
    }
    
    cambiarImagenGaleria(imagenActualIndex);
}

function abrirFormularioAdopcion() {
    if (!mascotaActual) return;
    
    const nombreMascotaElement = document.getElementById('nombre-mascota-form');
    if (nombreMascotaElement) {
        nombreMascotaElement.textContent = mascotaActual.nombre;
    }
    
    const modal = document.getElementById('modal-adopcion');
    if (modal) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

// Función auxiliar para cerrar modales con animación
function cerrarModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function setupModales() {
    // Modal galería
    const modalGaleria = document.getElementById('modal-galeria');
    if (modalGaleria) {
        const closeGaleria = modalGaleria.querySelector('.galeria-close');
        if (closeGaleria) {
            closeGaleria.addEventListener('click', () => {
                modalGaleria.style.display = 'none';
            });
        }
        
        // Navegación galería
        const btnAnterior = document.getElementById('btn-anterior');
        const btnSiguiente = document.getElementById('btn-siguiente');
        if (btnAnterior) btnAnterior.addEventListener('click', () => navegarGaleria('anterior'));
        if (btnSiguiente) btnSiguiente.addEventListener('click', () => navegarGaleria('siguiente'));
    }
    
    // Modal adopción
    const modalAdopcion = document.getElementById('modal-adopcion');
    if (modalAdopcion) {
        const closeAdopcion = modalAdopcion.querySelector('.modal-close');
        const cancelBtn = modalAdopcion.querySelector('.btn-cancel');
        
        if (closeAdopcion) {
            closeAdopcion.addEventListener('click', () => {
                cerrarModal(modalAdopcion);
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                cerrarModal(modalAdopcion);
            });
        }
        
        // Formulario adopción
        const form = document.getElementById('form-solicitud-adopcion');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                procesarSolicitudAdopcion();
            });
        }
    }
    
    // Cerrar modales al hacer click fuera
    window.addEventListener('click', (e) => {
        if (modalGaleria && e.target === modalGaleria) {
            modalGaleria.style.display = 'none';
        }
        if (modalAdopcion && e.target === modalAdopcion) {
            modalAdopcion.style.display = 'none';
        }
    });
}

function procesarSolicitudAdopcion() {
    // Validar campos obligatorios
    const camposObligatorios = [
        'nombre-adoptante', 'email-adoptante', 'telefono-adoptante',
        'direccion-adoptante', 'tipo-vivienda', 'razon-adopcion',
        'tiempo-dedicado', 'gastos-veterinarios'
    ];
    
    for (let campo of camposObligatorios) {
        const elemento = document.getElementById(campo);
        if (!elemento || !elemento.value.trim()) {
            alert(`Por favor completa el campo: ${elemento.previousElementSibling.textContent}`);
            elemento.focus();
            return;
        }
    }
    
    // Recopilar datos del formulario
    const formData = {
        mascotaId: mascotaActual.id,
        nombreMascota: mascotaActual.nombre,
        nombreAdoptante: document.getElementById('nombre-adoptante').value,
        email: document.getElementById('email-adoptante').value,
        telefono: document.getElementById('telefono-adoptante').value,
        edad: document.getElementById('edad-adoptante').value,
        direccion: document.getElementById('direccion-adoptante').value,
        tipoVivienda: document.getElementById('tipo-vivienda').value,
        tienePatio: document.getElementById('tiene-patio').value,
        experiencia: document.getElementById('experiencia-mascotas').value,
        otrasMascotas: document.getElementById('otras-mascotas').value,
        razonAdopcion: document.getElementById('razon-adopcion').value,
        tiempoDedicado: document.getElementById('tiempo-dedicado').value,
        gastosVeterinarios: document.getElementById('gastos-veterinarios').value,
        fechaSolicitud: new Date().toISOString()
    };
    
    // Simular envío con feedback visual
    const btnSubmit = document.querySelector('.btn-submit');
    if (btnSubmit) {
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando solicitud...';
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = '0.7';
    }
    
    // Simular proceso de adopción
    setTimeout(() => {
        // Guardar en localStorage para simular base de datos
        const solicitudes = JSON.parse(localStorage.getItem('solicitudesAdopcion') || '[]');
        solicitudes.push(formData);
        localStorage.setItem('solicitudesAdopcion', JSON.stringify(solicitudes));
        
        // Mostrar mensaje de éxito más atractivo
        mostrarMensajeExito(formData);
        
        // Cerrar modal y resetear formulario
        const modal = document.getElementById('modal-adopcion');
        if (modal) {
            cerrarModal(modal);
        }
        
        const form = document.getElementById('form-solicitud-adopcion');
        if (form) {
            setTimeout(() => form.reset(), 500);
        }
        
        if (btnSubmit) {
            btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
            btnSubmit.disabled = false;
            btnSubmit.style.opacity = '1';
        }
    }, 2000);
}

// Función para mostrar mensaje de éxito más atractivo
function mostrarMensajeExito(formData) {
    // Crear modal de éxito personalizado
    const modalExito = document.createElement('div');
    modalExito.className = 'modal-exito';
    modalExito.innerHTML = `
        <div class="modal-exito-content">
            <div class="exito-icon">
                <i class="fas fa-heart"></i>
            </div>
            <h2>¡Solicitud Enviada!</h2>
            <p><strong>¡Gracias ${formData.nombreAdoptante}!</strong></p>
            <p>Hemos recibido tu solicitud para adoptar a <strong>${formData.nombreMascota}</strong>.</p>
            <div class="exito-detalles">
                <p><i class="fas fa-building"></i> <strong>${mascotaActual.organizacion}</strong> se pondrá en contacto contigo en las próximas 24-48 horas.</p>
                <p><i class="fas fa-phone"></i> Te contactarán al: <strong>${formData.telefono}</strong></p>
                <p><i class="fas fa-envelope"></i> O por email: <strong>${formData.email}</strong></p>
            </div>
            <p class="exito-mensaje">¡Estamos emocionados de que ${formData.nombreMascota} pueda encontrar su hogar para siempre!</p>
            <button class="btn-exito" onclick="cerrarMensajeExito()">
                <i class="fas fa-check"></i> ¡Entendido!
            </button>
        </div>
    `;
    
    // Agregar estilos
    modalExito.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modalExito);
    
    // Animar entrada
    setTimeout(() => {
        modalExito.style.opacity = '1';
    }, 10);
    
    // Auto-cerrar después de 10 segundos
    setTimeout(() => {
        cerrarMensajeExito();
    }, 10000);
}

function cerrarMensajeExito() {
    const modalExito = document.querySelector('.modal-exito');
    if (modalExito) {
        modalExito.style.opacity = '0';
        setTimeout(() => {
            modalExito.remove();
        }, 300);
    }
}

function contactarOrganizacion() {
    if (!mascotaActual) return;
    
    const org = mascotaActual.contactoOrg;
    const mensaje = `¡Hola! Estoy interesado en adoptar a ${mascotaActual.nombre}. ¿Podrían darme más información sobre el proceso de adopción?`;
    
    const opciones = [
        `WhatsApp: ${org.telefono}`,
        `Email: ${org.email}`,
        `Teléfono: ${org.telefono}`
    ];
    
    const seleccion = prompt(`¿Cómo te gustaría contactar a ${mascotaActual.organizacion}?\n\n1. ${opciones[0]}\n2. ${opciones[1]}\n3. ${opciones[2]}\n\nEscribe el número de tu opción:`);
    
    switch(seleccion) {
        case '1':
            window.open(`https://wa.me/${org.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`);
            break;
        case '2':
            window.open(`mailto:${org.email}?subject=Interés en adoptar a ${mascotaActual.nombre}&body=${encodeURIComponent(mensaje)}`);
            break;
        case '3':
            alert(`Puedes llamar a ${mascotaActual.organizacion} al número:\n${org.telefono}\n\nMenciona que estás interesado en adoptar a ${mascotaActual.nombre}.`);
            break;
        default:
            break;
    }
}

function agregarAFavoritos(mascotaId) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    if (!favoritos.includes(mascotaId)) {
        favoritos.push(mascotaId);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        alert(`¡${mascotaActual.nombre} ha sido agregado a tus favoritos!`);
        
        // Actualizar visualmente el botón
        const btn = document.querySelector('.btn-favorito-hero');
        btn.innerHTML = '<i class="fas fa-bookmark"></i> En Favoritos';
        btn.classList.add('favorito-activo');
    } else {
        alert(`${mascotaActual.nombre} ya está en tus favoritos.`);
    }
}

function compartirMascota() {
    if (!mascotaActual) return;
    
    const url = window.location.href;
    const texto = `¡Mira a ${mascotaActual.nombre}! Es ${mascotaActual.raza.toLowerCase()} de ${mascotaActual.edadExacta} que está buscando un hogar lleno de amor. ¿Podrías ser tú su nueva familia?`;
    
    if (navigator.share) {
        navigator.share({
            title: `${mascotaActual.nombre} - PETHOUSE`,
            text: texto,
            url: url
        });
    } else {
        // Fallback para copiar al portapapeles
        navigator.clipboard.writeText(`${texto}\n\n${url}`).then(() => {
            alert('¡Enlace copiado al portapapeles! Compártelo con tus amigos y familiares.');
        });
    }
}

function cargarMascotasRelacionadas(mascotaActual) {
    // Filtrar mascotas similares (mismo tipo, diferente ID)
    const relacionadas = MASCOTAS_DATABASE.filter(m => 
        m.id !== mascotaActual.id && 
        m.tipo === mascotaActual.tipo
    ).slice(0, 3);
    
    if (relacionadas.length > 0) {
        const container = document.getElementById('relacionadas-grid');
        container.innerHTML = relacionadas.map(mascota => `
            <div class="mascota-card" onclick="window.location.href='proceso-adopcion.html?id=${mascota.id}'">
                <div class="mascota-imagen">
                    <img src="${mascota.imagen}" alt="${mascota.nombre}">
                </div>
                <div class="mascota-info">
                    <h3>${mascota.nombre}</h3>
                    <div class="mascota-detalles">
                        <span><i class="fas fa-birthday-cake"></i> ${mascota.edadExacta}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${mascota.ubicacion}</span>
                    </div>
                    <p>${mascota.descripcion.substring(0, 100)}...</p>
                </div>
            </div>
        `).join('');
        
        document.getElementById('mascotas-relacionadas').style.display = 'block';
    }
}

function mostrarError404() {
    const perfilContainer = document.getElementById('perfil-container');
    if (perfilContainer) {
        perfilContainer.style.display = 'none';
    }
    
    const errorContainer = document.getElementById('error-404');
    if (errorContainer) {
        errorContainer.style.display = 'block';
    }
}

// Funciones de utilidad
function calcularEdadDetallada(fechaNacimiento) {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    const meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + hoy.getMonth() - nacimiento.getMonth();
    
    if (meses < 12) {
        return `${meses} meses`;
    } else {
        const años = Math.floor(meses / 12);
        const mesesRestantes = meses % 12;
        return mesesRestantes > 0 ? `${años} años y ${mesesRestantes} meses` : `${años} años`;
    }
}

function calcularTiempoEnRefugio(fechaIngreso) {
    const ingreso = new Date(fechaIngreso);
    const hoy = new Date();
    const dias = Math.floor((hoy - ingreso) / (1000 * 60 * 60 * 24));
    
    if (dias < 30) {
        return `${dias} días`;
    } else if (dias < 365) {
        const meses = Math.floor(dias / 30);
        return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
        const años = Math.floor(dias / 365);
        const mesesRestantes = Math.floor((dias % 365) / 30);
        return mesesRestantes > 0 ? `${años} años y ${mesesRestantes} meses` : `${años} años`;
    }
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getNivelPorcentaje(nivel) {
    const niveles = {
        'Bajo': 25,
        'Bajo-Medio': 40,
        'Medio': 60,
        'Medio-Alto': 80,
        'Alto': 100
    };
    return niveles[nivel] || 50;
}

function getDescripcionPersonalidad(rasgos) {
    const descripciones = {
        'Cariñosa': 'Le encanta recibir y dar afecto',
        'Tranquila': 'Prefiere ambientes serenos y relajados',
        'Sociable': 'Disfruta de la compañía y es amigable',
        'Juguetón': 'Siempre está listo para jugar y divertirse',
        'Activo': 'Necesita ejercicio y estimulación física regular',
        'Leal': 'Forma vínculos fuertes con su familia',
        'Inteligente': 'Aprende rápido y responde bien al entrenamiento',
        'Noble': 'Tiene un carácter digno y sereno',
        'Protector': 'Cuida de su familia y territorio',
        'Gentil': 'Es suave y cuidadoso en sus interacciones'
    };
    
    const descripcionesRasgos = rasgos.map(rasgo => descripciones[rasgo] || '').filter(d => d);
    return `${mascotaActual.nombre} es una mascota con cualidades especiales: ${descripcionesRasgos.join(', ')}. Estas características hacen de ${mascotaActual.nombre} una compañía ideal para la familia adecuada.`;
}

console.log('🐾 Sistema de Perfil de Mascota PETHOUSE cargado correctamente');